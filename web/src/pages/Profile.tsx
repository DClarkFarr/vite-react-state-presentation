import UserForm, { UserFormState } from "../components/Forms/UserForm";
import UserService from "../services/userService";

const Profile = () => {
  const handleSubmit = async (values: UserFormState) => {
    await UserService.setUser(values.name);
  }

  return <div className="profile">
    <h1>
      Profile
    </h1>
    
    <UserForm onSubmit={handleSubmit} />
  </div>;
};

export default Profile;
