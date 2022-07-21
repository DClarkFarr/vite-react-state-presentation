import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { User } from "../../types/UserTypes";

export type UserFormState = {
  name: string;
}
export type UserFormProps = {
  user?: User;
  onSubmit: (values: UserFormState) => Promise<void>;
};
const UserForm = ({user, onSubmit}: UserFormProps) => {
  const [saving, setSaving] = useState(false);

  const { 
    handleChange,
    handleBlur,
    handleSubmit,
    values, 
    errors,
    touched,
    isValid,
    setValues,
    resetForm,
  } = useFormik<UserFormState>({
    initialValues: {
      name: user?.name || '',
    },
    onSubmit: async (values) => {
      setSaving(true);
      await onSubmit(values);
      resetForm();
      setSaving(false);
    },
    validate: (values) => {
      const errors: Partial<UserFormState> = {};
      if (!values.name || values.name.length < 5) {
        errors.name = 'Name is Required';
      }
      return errors;
    }
  });

  useEffect(() => {
    if(!user){
      setValues({
        name: '',
      }, true)
    }else{
      setValues({
        name: user.name,
      })
    }
  }, [user]);

  return (
    <div className="user-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input name="name" type="text" className="form-control" placeholder="Your Name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
        </div>
        <div className="form-group">
          <button type="submit" disabled={saving || !isValid} className="btn btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
      <div className="input-error">
        {touched.name && errors.name && <div>{errors.name}</div>}
      </div>
    </div>
  )
}
export default UserForm;
