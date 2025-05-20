export const cacheData = (key, data, expirationMinutes = 15) => {
  try {
    const item = {
      data,
      expiry: new Date().getTime() + expirationMinutes * 60 * 1000
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Error al guardar en caché:", error);
    return false;
  }
};

/**
 * Obtiene datos de la caché, verificando si han expirado
 * @param {string} key - Clave única para identificar los datos
 * @returns {any|null} - Datos almacenados o null si no existen o han expirado
 */
export const getCachedData = (key) => {
  try {
    const cachedItem = localStorage.getItem(`cache_${key}`);
    if (!cachedItem) return null;
    
    const item = JSON.parse(cachedItem);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }
    
    return item.data;
  } catch (error) {
    console.error("Error al recuperar datos de caché:", error);
    return null;
  }
};

/**
 * Elimina un elemento específico de la caché
 * @param {string} key - Clave del elemento a eliminar
 */
export const removeCachedItem = (key) => {
  localStorage.removeItem(`cache_${key}`);
};

/**
 * Limpia toda la caché de la aplicación
 */
export const clearCache = () => {
  const cacheKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('cache_')) {
      cacheKeys.push(key);
    }
  }
  
  cacheKeys.forEach(key => localStorage.removeItem(key));
};

/**
 * Actualiza un elemento en la caché con nuevos datos manteniendo 
 * su tiempo de expiración original
 * @param {string} key - Clave del elemento a actualizar
 * @param {any} newData - Nuevos datos para actualizar
 */
export const updateCachedItem = (key, newData) => {
  try {
    const cachedItem = localStorage.getItem(`cache_${key}`);
    if (!cachedItem) return false;
    
    const item = JSON.parse(cachedItem);
    item.data = newData;
    
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Error al actualizar elemento en caché:", error);
    return false;
  }
};