import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const LazyImage = ({
  src,
  alt,
  className = "",
  placeholderSrc = null,
  fallbackSrc = null,
  width,
  height,
  loadingClassName = "opacity-30",
  onClick,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    placeholderSrc ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWVlZSIvPjwvc3ZnPg=="
  );
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Cargar imágenes antes de que sean visibles
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [src]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <img
      ref={imgRef}
      src={isError && fallbackSrc ? fallbackSrc : imageSrc}
      alt={alt}
      width={width}
      height={height}
      onLoad={handleImageLoad}
      onError={handleImageError}
      onClick={onClick}
      className={`${className} ${!isLoaded ? loadingClassName : ""}`}
      {...rest}
    />
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderSrc: PropTypes.string,
  fallbackSrc: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loadingClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default LazyImage;
