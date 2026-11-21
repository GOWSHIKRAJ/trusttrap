export default function MessageThread({ scenario }) {
  return (
    <figure className="thread">
      <figcaption className="thread__head">
        <span className="thread__channel">{scenario.channel}</span>
        <span>{scenario.sender}</span>
      </figcaption>
      <p className="thread__bubble">{scenario.message}</p>
      <p className="thread__time">{scenario.received}</p>
    </figure>
  );
}
