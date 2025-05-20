import { HeartIcon } from "@heroicons/react/24/solid";
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Global } from "../../../helpers/Global";

export default function LikeButton({ initialLikes, initialLiked, publicationId, onLikeChange }) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleLikeClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${Global.url}publication/like/${publicationId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        }
      });

      if (!response.ok) {
        throw new Error('Error al procesar el like');
      }

      const data = await response.json();
      setLikeCount(data.likesCount);
      setIsLiked(!isLiked);
      onLikeChange?.(data.likesCount);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLikeClick}
      disabled={isLoading}
      className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors duration-200"
      aria-label={isLiked ? "Quitar me gusta" : "Me gusta"}
    >
      <HeartIcon
        className={`w-6 h-6 transition-all duration-300 transform ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'fill-transparent'}`} 
        stroke="currentColor"
        strokeWidth={isLiked ? 0 : 1.5}
      />
      <span className={`font-medium ${isLiked ? 'text-red-500' : 'text-gray-600'}`}>
        {likeCount}
      </span>
    </button>
  );
}

LikeButton.propTypes = {
  initialLikes: PropTypes.number.isRequired,
  initialLiked: PropTypes.bool.isRequired,
  publicationId: PropTypes.string.isRequired,
  onLikeChange: PropTypes.func
};