import handleInput from './utils/inputUtils.js';
import { postLogIn, sendToken } from './fetchAPI.js';

const validateToken = () => {
  console.log(sendToken);
  if(sendToken.token !== "" &&  sendToken.token !== null) {
    window.location.replace("home.html")
  } else {
    console.log("There is no existing token");
  }
};


const validateForm = (formSelector, callback) => {
  const formElement = document.querySelector(formSelector);
  formElement.setAttribute('novalidate', '');

  const validationOptions = [
    {
      attribute: 'required',
      isValid: input => input.value.trim() !== '',
      errorMessage: (input, placeholder) => `${placeholder.textContent} is required.`
    }
  ];

  const validateSingleFormGroup = formGroup => {
    const textField = formGroup.querySelector('.text-field');
    const placeholder = formGroup.querySelector('.text-field .placeholder');
    const input = formGroup.querySelector('input');
    const helper = formGroup.querySelector('.text-field .helper');
    const submitButton = formGroup.querySelector('button[type="submit"]');

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

const handlePostLoginUserResult = async (formElement, result) => {
  const passwordTextField = formElement.querySelector('#password').parentNode;
  const passwordHelper = passwordTextField.querySelector('.helper');

  if (!result) {
    passwordHelper.textContent = 'The username or password is incorrect.';
    passwordHelper.classList.add('error' ,'shake');

    passwordTextField.addEventListener('animationend', function() {
      passwordHelper.classList.remove('shake');
    });
  }
};

const sendtoAPI =  async (formElement) => {
  const formObject = Array.from(formElement.elements)
    .filter(element => element.type !== 'submit')
    .reduce((accumulator, element) => ({
      ...accumulator, [element.id]: element.value
    }), {});

    try {
      const result = await await postLogIn(formObject);
      await handlePostLoginUserResult(formElement, result);
    } catch (error) {
      console.error('Error occurred while creating user:', error);
    }
}

validateToken();
validateForm('#JS-loginForm', sendtoAPI);
handleInput('.text-field input');

