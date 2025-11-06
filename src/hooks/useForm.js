import { useState, useCallback, useEffect } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    if (validate) {
      const { name } = e.target;
      const fieldErrors = validate({ [name]: values[name] });
      setErrors(prev => ({ ...prev, ...fieldErrors }));
    }
  }, [validate, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  useEffect(() => {
    if (isSubmitting && validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [isSubmitting, validate, values]);

  return {
    values,
    errors,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleBlur,
    resetForm,
    setValues,
  };
};

export default useForm;