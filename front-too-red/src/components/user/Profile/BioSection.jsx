import PropTypes from "prop-types";

const BioSection = ({ user }) => (
  <div className="mt-2">
    {user.bio ? (
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {user.bio}
      </p>
    ) : (
      <p className="text-gray-500 italic">Este usuario no tiene biografía.</p>
    )}
    
    {user.interests && user.interests.length > 0 && (
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Intereses:</p>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((interest, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

BioSection.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    nick: PropTypes.string.isRequired,
    bio: PropTypes.string,
    interests: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default BioSection;