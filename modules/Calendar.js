import { Button } from '@blueprintjs/core';

const listUpcomingEvents =
  typeof window === 'undefined'
    ? require('../api/FakeFunction')
    : require('../api/AuthAPI').listUpcomingEvents;

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  const pre = document.getElementById('content');
  const textContent = document.createTextNode(`${message}\n`);
  pre.appendChild(textContent);
}

const printItems = () => {
  listUpcomingEvents().then((result) => {
    appendPre(result);
    console.log(result);
  });
};

const Calendar = () => {
  return (
    <div>
      <Button text="get events" onClick={printItems} />
      <pre id="content" style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
};

export { Calendar };
