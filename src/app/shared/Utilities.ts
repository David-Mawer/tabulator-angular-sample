import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs'

export class Utilities {
  // Create a new instance of the dayjs date object.
  static newDate(date?: dayjs.ConfigType, format?: dayjs.OptionType): dayjs.Dayjs {
    dayjs.extend(customParseFormat);
    if (date === undefined) {
      return dayjs();
    }
    if (format) {
      return dayjs(date, format);
    } else {
      return dayjs(date);
    }
  }
}