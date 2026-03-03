export function signupInitialValues() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatarFile: null,
    avatarFileName: "",
    acceptTerms: false,
  };
}

export function mapSignupPayload(values, role, avatarFileId) {
  return {
    role,
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    avatarFileId: avatarFileId || null,
  };
}