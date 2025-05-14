import * as React from 'react';

export default function ProgressBar(props) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setProgress((prevProgress) => (prevProgress >= 100 ? 0 : props.value));
  }, [props.value]);

  const currentQuestion = Math.round(props.value/100*12);
  const totalQuestions = 12;

  return (
    <div className="pt-4 pb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          진행 상황
        </span>
        <span className="text-sm font-medium text-primary">
          {currentQuestion}/{totalQuestions}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
          style={{width: `${progress}%`}}
        ></div>
      </div>
    </div>
  );
}