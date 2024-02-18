import handleInput from './utils/inputUtils.js';
import { postCreateUser, sendToken } from './fetchAPI.js';
/*
 * Validates the form matched by the provided selector. 
 * Loops through all validation rules defined in validationOptions, 
 * checks if the input passes each rule, and shows an error if not.
 * Handles real-time validation on blur and on submit.
 */

const validateToken = () => {
  console.log(sendToken);
  if(sendToken.token !== "" &&  sendToken.token !== null) {
    window.location.replace("home.html")
  } else {
    console.log("There is no existing token");
  }
}

const validateForm = (formSelector, callback) => {
  const formElement = document.querySelector(formSelector);
  formElement.setAttribute('novalidate', '');

  /*
   * validationOptions - Array of validation rule objects to check form inputs against.
   * Each object has:
   * - attribute - The attribute to check on the input (e.g. minlength). 
   * - isValid - Validation function that returns true if valid.
   * - errorMessage - Function to generate error message if invalid.
   */
  const validationOptions = [
    {
      attribute: 'maxlength',
      isValid: input => input.value.length <= 15,
      errorMessage: (input, placeholder) => `${placeholder.textContent} cannot exceed 15 characters.`
    },
    {
      attribute: 'minlength',
      isValid: input => input.value && input.value.length >= parseInt(input.minLength, 10),
      errorMessage: (input, placeholder) => `${placeholder.textContent} must be at least ${input.minLength} characters.`
    },
    {
      attribute: 'match',
      isValid: input => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(`#${matchSelector}`);
        return matchedElement && matchedElement.value.trim() === input.value.trim();
      },
      errorMessage: (input, placeholder) => {
        const matchSelector = input.getAttribute('match');
        const matchedElement = formElement.querySelector(`#${matchSelector}`);
        const matchedLabel = matchedElement.parentElement.querySelector('.placeholder');

        return `${placeholder.textContent} should match ${matchedLabel.textContent}`
      }
    },
    {
      attribute: 'pattern',
      isValid: input => {
        const patternRegEx = new RegExp(input.pattern);
        return patternRegEx.test(input.value);
      },
      errorMessage: (input, placeholder) => `${placeholder.textContent} is invalid.`
    },
    {
      attribute: 'required',
      isValid: input => input.value.trim() !== '',
      errorMessage: (input, placeholder) => `${placeholder.textContent} is required.`
    }
  ];

  /*
   * Validates a single form group by checking its input element against 
   * the validation options rules. Shows error message on failure or 
   * success message on pass. Returns true if valid.
   * formGroup - The form group element to validate
  */
  const validateSingleFormGroup = formGroup => {
    const textField = formGroup.querySelector('.text-field');
    const placeholder = formGroup.querySelector('.text-field .placeholder');
    const input = formGroup.querySelector('input');
    const helper = formGroup.querySelector('.text-field .helper');

    let formGroupError = false;
    for (const option of validationOptions) {
      if (input.hasAttribute(option.attribute) && !option.isValid(input)) {
        helper.textContent = option.errorMessage(input, placeholder);
        helper.classList.add('shake');
        textField.classList.add('error');
        formGroupError = true;
      }
    }

    if (!formGroupError) {
      helper.textContent = '';
      textField.classList.remove('error');
    }

    textField.addEventListener('animationend', function() {
      helper.classList.remove('shake');
    });
    
    return !formGroupError;
  };

  Array.from(formElement.elements).forEach(element => {
    element.addEventListener('blur', event => {
      validateSingleFormGroup(event.srcElement.parentElement.parentElement)
    });
  });

   /*
   * Validates all form groups in a form.
   * Loops through all the form groups in the provided form 
   * and validates each one using validateSingleFormGroup().
   * Returns true if all form groups are valid, false otherwise.
   */
  const validateAllFormGroups = formToValidate => {
    const formGroups = Array.from(formToValidate.querySelectorAll('.JS-formGroup'));

    return formGroups.every(formGroup => validateSingleFormGroup(formGroup));
  };

  formElement.addEventListener('submit', event => {
    const formValid = validateAllFormGroups(formElement);
    event.preventDefault();

    if (formValid) {
      callback(formElement);
    }
  });
};

const handlePostCreateUserResult = async (formElement, result) => {
  const usernameTextField = formElement.querySelector('#username').parentNode;
  const usernamePlaceholder = usernameTextField.querySelector('.placeholder');
  const usernameHelper = usernameTextField.querySelector('.helper');

  if (!result) {
    usernameHelper.textContent = `${usernamePlaceholder.textContent} already exists.`;
    usernameTextField.classList.add('error');
    usernameHelper.classList.add('shake');

    usernameTextField.addEventListener('animationend', function() {
      usernameHelper.classList.remove('shake');
    });
  }
};

const sendtoAPI =  async (formElement) => {
  const formObject = Array.from(formElement.elements)
    .filter(element => element.type !== 'submit' && element.id !== 'confirmPassword')
    .reduce((accumulator, element) => ({
      ...accumulator, [element.id]: element.value
    }), {});

    try {
      const result = await postCreateUser(formObject);
      await handlePostCreateUserResult(formElement, result);
    } catch (error) {
      console.error('Error occurred while creating user:', error);
      // Handle error if necessary
    }
}

validateToken();
validateForm('#JS-signupForm', sendtoAPI);
handleInput('.text-field input');