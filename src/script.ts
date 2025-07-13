import type { SerpApiResponse } from "../src/schemas";

// "DOMContentLoaded" waits for the browser to finish loading all the HTML content
document.addEventListener("DOMContentLoaded", () => {
  // --- Element Selection ---
  const form = document.querySelector<HTMLFormElement>("#search-form");
  const input = document.querySelector<HTMLInputElement>("#query-input");
  const button = document.querySelector<HTMLButtonElement>("#submit-button");
  const errorMsg =
    document.querySelector<HTMLParagraphElement>("#error-message");
  const successMsg =
    document.querySelector<HTMLParagraphElement>("#success-message");

  if (!form || !input || !button || !errorMsg || !successMsg) {
    console.error(
      "One or more required form elements could not be found in the DOM."
    );
    return;
  }

  // --- Helper Functions ---

  // This function handles downloading the JSON file
  const downloadJson = (data: unknown, filename: string): void => {
    // --- Step 1: Convert the Data Object to a String ---
    // JSON.stringify(value, replacer, space)
    const jsonString = JSON.stringify(data, null, 2);

    // --- Step 2: Makes the string safe to be used inside a URL
    const encodedJsonString = encodeURIComponent(jsonString);

    // --- Step 3: Define the Data Header ---
    // Data URI is a special link that contains the file data
    const dataUriPrefix = "data:application/json;charset=utf-8,";

    // --- Step 4: Create the Full Data URI ---
    const fullDataUri = dataUriPrefix + encodedJsonString;

    // --- Step 5: Trigger the Download ---
    // Create a hidden link element.
    const downloadLink = document.createElement("a");
    downloadLink.href = fullDataUri;
    downloadLink.download = filename;

    // It automatically starts the download
    downloadLink.click();
  };

   const setLoadingState = (isLoading: boolean): void => {
     // Find text and spinner elements inside the button.
     const buttonText = button.querySelector(".button-text");
     const buttonSpinner = button.querySelector(".button-spinner");
     button.disabled = isLoading;

     if (isLoading) {
       button.disabled = true;
       if (buttonText) {
         buttonText.classList.add("hidden");
       }
       if (buttonSpinner) {
         buttonSpinner.classList.remove("hidden");
       }
     } else {
       button.disabled = false;
       if (buttonText) {
         buttonText.classList.remove("hidden");
       }
       if (buttonSpinner) {
         buttonSpinner.classList.add("hidden");
       }
     }
   };

  const validateInput = (): boolean => {
    // It removes any extra spaces from the ends
    const trimmedValue = input.value.trim();

    const isValid = trimmedValue !== "";

    if (isValid) {
      input.classList.add("border-gray-300");
      input.classList.remove("border-inizio-red");
      errorMsg.classList.add("hidden");
    } else {
      input.classList.add("border-inizio-red");
      input.classList.remove("border-gray-300");
      errorMsg.classList.remove("hidden");
    }
    return isValid;
  };

  // --- Main Event Listener ---

  form.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();

    if (!validateInput()) {
      return;
    }

    setLoadingState(true);
    // Hides old messages when starting a new search
    errorMsg.classList.add("hidden");
    successMsg.classList.add("hidden");

    try {
      const response = await fetch(`/api/inizio-google?query=${input.value}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Server returned status: ${response.status}`
        );
      }

      const data: SerpApiResponse = await response.json();
      downloadJson(data.organic_results, "results.json");
      successMsg.classList.remove("hidden");
    } catch (err) {

      if (err instanceof Error) {
        // It allows to displays message from the server to users
        errorMsg.textContent = err.message;
        console.error(
          "An error appeared during the fetch process:",
          err.message
        );
      } else {
        errorMsg.textContent = "Došlo k neočekávané chybě.";
        console.error("An unexpected object appeared:", err);
      }
      errorMsg.classList.remove("hidden");
    } finally {
      setLoadingState(false);
    }
  });

  // 'blur' is the event that happens when the user clicks away from the input field
  input.addEventListener("blur", validateInput);
});