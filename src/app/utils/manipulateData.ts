import moment from 'moment-timezone';
class ManipulateData {
  validateData(text: string): boolean {
    if (!(text.length === 5)) {
      return false;
    } else if (
      !moment(
        `${moment().format('YYYY')}-${text.substring(3, 5)}-${text.substring(
          0,
          2
        )}`
      ).isValid()
    ) {
      return false;
    } else if (
      !moment(
        `${moment().format('YYYY')}-${text.substring(3, 5)}-${text.substring(
          0,
          2
        )}`
      ).isSameOrAfter(moment().hours(0).minutes(0).seconds(0).milliseconds(0))
    ) {
      return false;
    }
    return true;
  }

  formatData(text: string): moment.Moment {
    return moment(
      `${moment().format('YYYY')}-${text.substring(3, 5)}-${text.substring(
        0,
        2
      )}`
    );
  }
}

export default new ManipulateData();
