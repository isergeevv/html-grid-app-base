export default class ElementData {
  private _element: HTMLElement;

  constructor(element: HTMLElement) {
    this._element = element;
  }

  has(key: string): boolean {
    return this._element.hasAttribute(`data-${key}`);
  }

  get(key: string): string | null {
    return this._element.getAttribute(`data-${key}`);
  }

  set(key: string, value: string = ''): void {
    this._element.setAttribute(`data-${key}`, value);
  }

  remove(key: string): void {
    this._element.removeAttribute(`data-${key}`);
  }

  toggle(key: string, value: boolean): void {
    if (value) {
      this.set(key);
    } else {
      this.remove(key);
    }
  }
}
