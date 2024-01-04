const onlyLettersAndSpaces = (str) => {
  return /^[A-Za-z\s]*$/.test(str);
};

/**
 * Checks if the given name contains only letters and spaces.
 * It will also update the error message shown to the user, with a
 * suitable text.
 * @param {*} name
 * @returns true if the name is valid, false otherwise
 */
const validateName = (name) => {
  if (!name) {
    error.innerText = "Name is not provided!";
    return false;
  }

  if (!onlyLettersAndSpaces(name)) {
    error.innerText = "Name should only contain letters and spaces!";
    return false;
  }

  return true;
};

/**
 * Makes sure that the user has selected one of the genders.
 * @returns false if neither of the genders are selected
 */
const validateGender = () => {
  if (!isMale.checked && !isFemale.checked) {
    console.log("here");
    error.innerText = "Please select a gender!";
    return false;
  }
  return true;
};

/**
 * Updates the prediction text with the given values
 * @param {*} param0 - gender and its probability
 * @param {*} name - name
 */
const showPrediction = ({ gender, probability }, name) => {
  // handling the case where the api doesn't have any prediction for the name
  if (!gender) {
    error.innerText = "We currently don't have any prediction for this name :(";
  }

  const percentage = probability * 100;
  predictionText.innerText = `${name} is ${percentage}% ${gender}`;
};

/**
 * Predicts the gender of the given name from an external API.
 * It will show the result or error to the user.
 * @param {*} name
 */
const fetchPrediction = async (name) => {
  const url = new URL("https://api.genderize.io/");

  const params = { name: name };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url, { method: "GET" });
  if (response.ok) {
    const body = await response.json();
    showPrediction(body, name);
  } else {
    error.innerText = "An error occurred :(";
  }
};

/**
 * Updates the name and gender shown in the "save answer" section.
 * It will also update the global variable "currentSavedAnswer".
 * @param {*} name
 * @param {*} gender
 */
const updateSavedAnswer = (name, gender) => {
  savedAnswerText.innerText = `${name} is ${gender}`;

  // update current saved answer that is shown to the user
  currentSavedAnswer.name = name;
  currentSavedAnswer.gender = gender;
};

/**
 * Gets the gender of the given name from localStorage.
 * If no gender is found, it will show a message to the user.
 * @param {*} name
 */
const getSavedValues = (name) => {
  const gender = localStorage.getItem(name);
  if (gender) {
    updateSavedAnswer(name, gender);
  } else {
    savedAnswerText.innerText = `No gender is saved for ${name}`;
  }
};

/**
 * It will validate the form and if everything is ok, it will get the
 * saved gender of the given name from localStorage. Then, it will fetch
 * the name's gender prediction from an external API.
 * @param {*} event
 */
const handleFormSubmit = (event) => {
  event.preventDefault();

  const { value: name } = nameInput;
  if (validateName(name)) {
    error.innerText = "";
    getSavedValues(name);
    fetchPrediction(name);
  }
};

/**
 * Saves the given name and its given gender to localStorage if the name
 * is valid and a gender is selected.
 * It will show the saved values to the user as well.
 */
const handleSave = () => {
  const { value: name } = nameInput;
  if (validateName(name) && validateGender()) {
    error.innerText = "";

    const isMaleChecked = isMale.checked;
    const gender = isMaleChecked ? "male" : "female";

    localStorage.setItem(name, gender);
    updateSavedAnswer(name, gender);
  }
};

/**
 * Clears the current name and gender from localStorage.
 */
const handleClear = () => {
  localStorage.removeItem(currentSavedAnswer.name);
};

const nameInput = document.getElementById("name");
const error = document.getElementById("error");
const form = document.getElementById("form");
const isMale = document.getElementById("male");
const isFemale = document.getElementById("female");
const predictionText = document.getElementById("prediction");
const savedAnswerText = document.getElementById("saved-answer");

/* 
  We should have access to the current saved answer that we're showing 
  to the user, in order to be able to clear it from localStorage 
*/
const currentSavedAnswer = {
  name: "",
  gender: "",
};

form.onsubmit = handleFormSubmit;
