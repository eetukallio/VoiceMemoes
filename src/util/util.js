export const parseDate = d => {
  const dateAndTime = d.split('T');
  const date = dateAndTime[0];
  const time = dateAndTime[1];
  const yearMonthDay = date.split('-');
  const year = yearMonthDay[0];
  const month = yearMonthDay[1];
  const day = yearMonthDay[2];
  const hourMinutes = time.split(':');
  const hours = hourMinutes[0];
  const minutes = hourMinutes[1];

  return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes;
};

export const parseDuration = durationInSeconds => {
  if (durationInSeconds / 60 >= 1) {
    return (
      durationInSeconds / 60 +
      ' minutes ' +
      (durationInSeconds % 60) +
      ' seconds '
    );
  } else {
    return durationInSeconds.toFixed(0) + ' seconds';
  }
};
