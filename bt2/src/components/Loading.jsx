import { ClipLoader } from 'react-spinners';

export default function Loading({ isLoading, size = 100, color = '#b32346' }) {
  return (
    <div className='loading-container'>
      {isLoading && (
        <ClipLoader className='clip-loader' size={size} color={color} />
      )}
    </div>
  );
}
