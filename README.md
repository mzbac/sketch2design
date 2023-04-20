# Image-to-DSL Model Frontend UI

This repository contains the frontend user interface for the Image-to-DSL model API. It allows users to call the API and display the generated HTML result.

## Getting Started

To get started, first modify the API configuration in the `src/api/generate_code.ts` file to use your own backend.

```
// Replace the 'API_URL' with your own backend API URL
const API_URL = "https://your-backend-api-url.com";
```

## Installation

1. Install dependencies:

```

   npm install

```

2. Start the development server:

```

npm run dev

```

Now, you should be able to access the frontend UI at `http://localhost:3000/`. Upload an image or sketch, and the frontend will call the API to generate the corresponding DSL code and display the HTML result.

## Contributing

Feel free to submit pull requests, report issues, or request new features. Your contributions are always welcome!

```

```
