const VideoPlayer = ({ id }: { id: string }) => {
  return (
    <iframe
      width="400px"
      height="225px"
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube video player"
      //   frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

export default VideoPlayer;
