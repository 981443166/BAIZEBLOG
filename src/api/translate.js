/**
 * 翻译 API - 使用 MyMemory 免费翻译服务
 * https://mymemory.translated.net/
 * 
 * 包含缓存和限流机制以避免 429 错误
 */

// 翻译缓存（内存缓存，页面刷新后清除）
const translationCache = new Map();

// 请求队列和限流
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 最小请求间隔 1 秒
const MAX_CACHE_SIZE = 100; // 最大缓存条目数

// 检测文本语言（简单启发式）
function detectLanguage(text) {
  // 包含中文字符
  if (/[\u4e00-\u9fff]/.test(text)) {
    return 'zh';
  }
  // 默认返回英文
  return 'en';
}

// 获取目标语言（与源语言相反）
function getTargetLanguage(sourceLang) {
  const currentLang = localStorage.getItem('i18n-lang') || 'zh';
  // 如果当前界面语言与源语言相同，则翻译为另一种语言
  if (sourceLang === currentLang) {
    return currentLang === 'zh' ? 'en' : 'zh';
  }
  // 否则翻译为当前界面语言
  return currentLang;
}

// 生成缓存键
function getCacheKey(text, sourceLang, targetLang) {
  return `${text}|${sourceLang}|${targetLang}`;
}

// 清理旧缓存（保持缓存大小在限制内）
function cleanCache() {
  if (translationCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(translationCache.entries());
    // 删除最旧的一半
    const deleteCount = Math.floor(entries.length / 2);
    for (let i = 0; i < deleteCount; i++) {
      translationCache.delete(entries[i][0]);
    }
  }
}

// 等待指定时间
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 带限流的 fetch 请求
async function fetchWithRateLimit(url, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    // 确保请求间隔足够
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    
    lastRequestTime = Date.now();
    
    try {
      const response = await fetch(url);
      
      // 处理 429 错误（请求过多）
      if (response.status === 429) {
        if (attempt < retries) {
          // 指数退避：等待时间翻倍
          const waitTime = Math.pow(2, attempt) * 2000;
          console.warn(`翻译 API 限流，${waitTime/1000}秒后重试...`);
          await sleep(waitTime);
          continue;
        }
        throw new Error('翻译服务请求过于频繁，请稍后再试');
      }
      
      if (!response.ok) {
        throw new Error('翻译请求失败');
      }
      
      return response;
    } catch (error) {
      if (error.message === '翻译服务请求过于频繁，请稍后再试' || 
          error.message === '翻译请求失败') {
        throw error;
      }
      
      // 网络错误，如果不是最后一次尝试则重试
      if (attempt < retries) {
        await sleep(1000);
        continue;
      }
      
      throw new Error('网络连接失败，请检查网络后重试');
    }
  }
}

/**
 * 翻译文本
 * @param {string} text - 要翻译的文本
 * @param {string} targetLang - 目标语言 ('zh' 或 'en')
 * @returns {Promise<{translatedText: string, sourceLang: string, targetLang: string}>}
 */
export async function translateText(text, targetLang = null) {
  if (!text || !text.trim()) {
    throw new Error('翻译内容不能为空');
  }

  const trimmedText = text.trim();
  const sourceLang = detectLanguage(trimmedText);
  const target = targetLang || getTargetLanguage(sourceLang);

  // 如果源语言和目标语言相同，直接返回
  if (sourceLang === target) {
    return { translatedText: trimmedText, sourceLang, targetLang: target };
  }

  // 检查缓存
  const cacheKey = getCacheKey(trimmedText, sourceLang, target);
  if (translationCache.has(cacheKey)) {
    return {
      translatedText: translationCache.get(cacheKey),
      sourceLang,
      targetLang: target
    };
  }

  const langPair = `${sourceLang}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmedText)}&langpair=${langPair}`;

  try {
    const response = await fetchWithRateLimit(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translatedText = data.responseData.translatedText;
      
      // 存入缓存
      translationCache.set(cacheKey, translatedText);
      cleanCache();
      
      return {
        translatedText,
        sourceLang,
        targetLang: target
      };
    }

    throw new Error(data.responseDetails || '翻译失败');
  } catch (error) {
    if (error.message === '翻译请求失败' || 
        error.message === '翻译失败' ||
        error.message === '翻译服务请求过于频繁，请稍后再试' ||
        error.message === '网络连接失败，请检查网络后重试') {
      throw error;
    }
    // 其他错误
    throw new Error('翻译服务暂时不可用，请稍后再试');
  }
}

/**
 * 清除翻译缓存
 */
export function clearTranslationCache() {
  translationCache.clear();
}
