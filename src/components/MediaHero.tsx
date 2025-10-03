type Props = {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt?: string;
};

const MediaHero = ({ type, src, poster, alt }: Props) => {
  if (type === 'video') {
    return (
      <div className="media-hero">
        <video className="media" playsInline autoPlay muted loop poster={poster}>
          <source src={src} />
        </video>
      </div>
    );
  }
  return (
    <div className="media-hero">
      <img className="media" src={src} alt={alt || ''} />
    </div>
  );
};

export default MediaHero;
