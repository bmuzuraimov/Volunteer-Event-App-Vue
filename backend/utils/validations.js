const validateEventFields = (event) => {
    let errors = [];
    if (!event.title || !event.organizer || isNaN(event.datetime) || !event.location || !event.description) {
        errors.push('Please fill in all required fields.');
    }
    if (event.quota <= 0) {
        errors.push('Quota should be a positive number.');
    }
    if (event.image && !/^https?:\/\/.+\..+/.test(event.image)) {
        errors.push('Image URL is not in the correct format.');
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
};

const validateVolunteerFields = (volunteer) => {
    let errors = [];
  
    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!volunteer.email || !emailPattern.test(volunteer.email)) {
      errors.push("Invalid email address.");
    }
  
    // Validate password (at least 8 characters)
    if (!volunteer.password || volunteer.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
  
    // Validate name (non-empty)
    if (!volunteer.name || volunteer.name.trim() === "") {
      errors.push("Name is required.");
    }
  
    // Validate contact (should be a number)
    if (!volunteer.contact || isNaN(volunteer.contact)) {
      errors.push("Contact should be a number.");
    }
  
    // Validate age group (non-empty)
    if (!volunteer.age_group || volunteer.age_group.trim() === "") {
      errors.push("Age group is required.");
    }
  
    // Validate remarks (non-empty)
    if (!volunteer.remarks || volunteer.remarks.trim() === "") {
      errors.push("Remarks are required.");
    }
  
    // Validate terms (must be agreed to)
    if (!volunteer.termsCheckbox) {
      errors.push("You must agree to the terms and conditions.");
    }
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

module.exports = {
    validateEventFields, validateVolunteerFields,
};