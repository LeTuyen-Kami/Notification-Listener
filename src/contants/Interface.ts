export interface INotification {
  app: string;
  appName: string;
  groupedMessages: any[];
  tag: Tag;
  text?: string;
  time: string;
  title: string;
  bigText?: string;
  subText?: string;
  titleBig?: string;
}

export enum Tag {
  RNNotificationListener = 'RNNotificationListener',
}

export interface IApp {
  packageName: string;
  appName: string;
}

export interface ISMS {
  messageAddress: string;
  messageBody: string;
  messageDate: string;
}
