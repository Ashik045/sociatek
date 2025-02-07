const TimeOut = () => {
  // 504 error is for the free deployment on netlify or railway.
  return (
    <div>
      <h1>504 - Server Timeout</h1>
      <p>This happend for the vercel free plan or something</p>
      <h4>Try refreshing this page.</h4>
    </div>
  );
};

export default TimeOut;
