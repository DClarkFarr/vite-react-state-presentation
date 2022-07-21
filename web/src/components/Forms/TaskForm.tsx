import { useEffect, useState } from "react";
import { useFormik } from 'formik';
import { Task } from "../../types/TaskTypes";

export type TaskFormState = {
  title: string;
}
export type TaskFormProps = {
  task?: Task;
  onSubmit: (values: TaskFormState) => Promise<void>;
};
const TaskForm = ({task, onSubmit}: TaskFormProps) => {
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
  } = useFormik<TaskFormState>({
    initialValues: {
      title: task?.title || '',
    },
    onSubmit: async (values) => {
      setSaving(true);
      await onSubmit(values);
      resetForm();
      setSaving(false);
    },
    validate: (values) => {
      const errors: Partial<TaskFormState> = {};
      if (!values.title || values.title.length < 5) {
        errors.title = 'Title is Required';
      }
      return errors;
    }
  });

  useEffect(() => {
    if(!task){
      setValues({
        title: '',
      }, true)
    }else{
      setValues({
        title: task.title,
      })
    }
  }, [task]);

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input name="title" type="text" className="form-control" placeholder="Task Title" value={values.title} onChange={handleChange} onBlur={handleBlur} />
        </div>
        <div className="form-group">
          <button type="submit" disabled={saving || !isValid} className="btn btn-primary">{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
      <div className="input-error">
        {touched.title && errors.title && <div>{errors.title}</div>}
      </div>
    </div>
  )
}
export default TaskForm;
