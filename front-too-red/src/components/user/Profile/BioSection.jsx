import PropTypes from "prop-types";

const BioSection = ({ user }) => (
  <div className="mt-4">
    <h2 className="text-lg text-gray-900">
      {user.name} {user.surname}
    </h2>
    <p className="text-sm text-gray-600">@{user.nick}</p>
    {user.bio && <p className="text-gray-700">{user.bio}</p>}
  </div>
);

BioSection.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    nick: PropTypes.string.isRequired,
    bio: PropTypes.string,
  }).isRequired,
};

export default BioSection;
