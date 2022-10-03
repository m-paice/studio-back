export default interface Job {
  handle(): Promise<void>;
}
