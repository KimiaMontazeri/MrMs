const onlyLettersAndSpaces = (str) => {
  return /^[A-Za-z\s]*$/.test(str);
};
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

const validateGender = () => {
  if (!isMale.checked && !isFemale.checked) {
    console.log("here");
    error.innerText = "Please select a gender!";
    return false;
  }
  return true;
};

const showPrediction = ({ gender, probability }, name) => {
  // handling the case where the api doesn't have any prediction for the name
  if (!gender) {
    error.innerText = "We currently don't have any prediction for this name :(";
  }

  const percentage = probability * 100;
  predictionText.innerText = `${name} is ${percentage}% ${gender}`;
};

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

const updateSavedAnswer = (name, gender) => {
  savedAnswerText.innerText = `${name} is ${gender}`;

  // update current saved answer that is shown to the user
  currentSavedAnswer.name = name;
  currentSavedAnswer.gender = gender;
};

const getSavedValues = (name) => {
  const gender = localStorage.getItem(name);
  if (gender) {
    updateSavedAnswer(name, gender);
  } else {
    savedAnswerText.innerText = `No gender is saved for ${name}`;
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const { value: name } = nameInput;
  if (validateName(name)) {
    error.innerText = "";
    getSavedValues(name);
    fetchPrediction(name);
  }
};

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
