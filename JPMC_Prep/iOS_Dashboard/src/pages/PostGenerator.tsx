import { useEffect } from "react";

const PostGenerator = () => {
  useEffect(() => {
    document.title = "Media Generator";
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src="http://localhost:8501" // Or your deployed streamlit URL
        width="100%"
        height="100%"
        title="Post Generator"
      />
    </div>
  );
};

export default PostGenerator;
