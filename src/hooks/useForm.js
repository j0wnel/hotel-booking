import { useState, useCallback } from 'react';

const useForm = (config) => {
  const {
    initialValues = {},
    validate,
    onSubmit,
    onError
  } = config;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const name = e?.target?.name ?? e?.name;
    const value = e?.target?.value ?? e?.value;
    
    if (!name) return; // Guard against invalid events

    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    if (validate) {
      const { name } = e.target;
      const validationErrors = validate({ ...values, [name]: values[name] });
      if (validationErrors[name]) {
        setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
      }
    }
  }, [validate, values]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all fields
      if (validate) {
        const validationErrors = validate(values);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsSubmitting(false);
          return;
        }
      }

      // If validation passes, call onSubmit
      if (onSubmit) {
        await onSubmit(values);
      }

      // Reset form on successful submission
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit, onError, initialValues]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
};

export default useForm;