import { Button } from '@blueprintjs/core';
import { useState } from 'react';

const listUpcomingEvents =
  typeof window === 'undefined'
    ? require('../api/FakeFunction')
    : require('../api/AuthAPI').listUpcomingEvents;

const Calendar = () => {
  const [items, setItems] = useState([]);

  const getItems = () => {
    listUpcomingEvents().then((result) => {
      setItems(result);
    });
  };

  return (
    <div>
      <h2>Google Calendar</h2>
      <Button text="get events" onClick={getItems} />
      <div>{items}</div>
    </div>
  );
};

export { Calendar };
