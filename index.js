const onlyLettersAndSpaces = (str) => {
  return /^[A-Za-z\s]*$/.test(str);
};

const showPrediction = ({ gender, probability }, name) => {
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

const handleFormSubmit = (event) => {
  event.preventDefault();

  const { value: name } = nameInput;

  // form validation
  if (!name) {
    error.innerText = "Name is not provided!";
    return;
  } else if (!onlyLettersAndSpaces(name)) {
    error.innerText = "Name should only contain letters and spaces!";
    return;
  }

  // form is valid
  error.innerText = "";
  fetchPrediction(name);
};

const nameInput = document.getElementById("name");
const error = document.getElementById("error");
const form = document.getElementById("form");
const isMale = document.getElementById("male");
const isFemale = document.getElementById("female");
const predictionText = document.getElementById("prediction");
form.onsubmit = handleFormSubmit;
