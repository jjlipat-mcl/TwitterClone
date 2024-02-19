/*
 * Adds input event listeners to text field inputs
 * that toggle a 'has-text' class based on if the 
 * input contains text.
 */
export default function handleInput(inputSelector) {
  const inputs = document.querySelectorAll(inputSelector);

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.value.trim() !== '') {
        input.classList.add('has-text');
      } else {
        input.classList.remove('has-text');
      }
    });
  });
}
