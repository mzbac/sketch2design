// pages/index.tsx
import { useState, ChangeEvent, useReducer } from "react";
import axios from "axios";
import styles from "./Home.module.css";

type State = {
  selectedFile: File | null;
  generatedCode: string;
  prompt: string;
};

type Action =
  | { type: "setSelectedFile"; payload: File }
  | { type: "setGeneratedCode"; payload: string }
  | { type: "setPrompt"; payload: string };

const initialState: State = {
  selectedFile: null,
  generatedCode: "",
  prompt: "",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setSelectedFile":
      return { ...state, selectedFile: action.payload };
    case "setGeneratedCode":
      return { ...state, generatedCode: action.payload };
    case "setPrompt":
      return { ...state, prompt: action.payload };
    default:
      return state;
  }
}

const Home: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);

  const fileChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      dispatch({ type: "setSelectedFile", payload: files[0] });
    }
  };

  const promptChangedHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "setPrompt", payload: event.target.value });
  };

  const uploadImage = async () => {
    if (state.selectedFile) {
      setLoading(true); // Set loading to true

      const reader = new FileReader();
      reader.onload = async (event) => {
        const image_data = (event.target?.result as string).split(",")[1];
        try {
          const response = await axios.post("/api/generate_code", {
            image_data,
            prompt: state.prompt,
          });
          dispatch({
            type: "setGeneratedCode",
            payload: response.data.generated_code,
          });
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setLoading(false); // Set loading to false
        }
      };
      reader.readAsDataURL(state.selectedFile);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Image to HTML Code Generator</h1>
      </header>
      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <input
            type="file"
            onChange={fileChangedHandler}
            className={styles.fileInput}
          />
          <input
            type="text"
            value={state.prompt}
            onChange={promptChangedHandler}
            placeholder="Optional prompt"
          />
        </div>
        <button onClick={uploadImage} className={styles.generateButton}>
          Generate Code
        </button>
        {loading && (
          <div className={styles.loading}>
            <p>Loading...</p>
          </div>
        )}
        <h2>Rendered HTML:</h2>
        <iframe srcDoc={state.generatedCode} className={styles.iframe}></iframe>
      </div>
    </div>
  );
};

export default Home;
