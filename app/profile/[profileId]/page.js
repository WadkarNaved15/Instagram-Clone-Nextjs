import Profile from '@/components/Profile';

const UserProfile = ({ params }) => {
  const { profileId } = params;
  return <Profile profileId={profileId} />;
};

export default UserProfile;
