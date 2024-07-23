import * as React from 'react';

export default function ProgressBar(props) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setProgress((prevProgress) => (prevProgress >= 100 ? 0 : props.value));
  }, [props.value]);

  return (
    <div className="pt-10 flex justify-center items-center">
      <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-orange-200 h-2.5 rounded-full" style={{width: `${progress}%`}}></div><span>{Math.round(props.value/100*12)}/12</span>
      </div>
    </div>
  );
}