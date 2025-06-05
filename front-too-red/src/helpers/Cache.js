export const cacheData = (key, data, expirationMinutes = 15) => {
  try {
    const item = {
      data,
      expiry: new Date().getTime() + expirationMinutes * 60 * 1000,
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error("Error al guardar en caché:", error);
    return false;
  }
};

//Obtiene datos de caché y verifica si han expirado
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

//Elimina elemento específico de la caché
export const removeCachedItem = (key) => {
  localStorage.removeItem(`cache_${key}`);
};

//Limpia toda la caché
export const clearCache = () => {
  const cacheKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("cache_")) {
      cacheKeys.push(key);
    }
  }

  cacheKeys.forEach((key) => localStorage.removeItem(key));
};

//Actualiza elemento manteniendo su expiración original
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
