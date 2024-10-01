declare module '@tarekraafat/autocomplete.js' {
    interface AutocompleteOptions {
      selector: string;
      data: {
        src: string[];
      };
      threshold?: number;
      debounce?: number;
      searchEngine?: string;
      maxResults?: number;
      highlight?: boolean;
    }
  
    class Autocomplete {
      constructor(options: AutocompleteOptions);
      // 필요한 추가 메서드나 속성이 있다면 여기에 정의합니다
    }
  
    export default Autocomplete;
  }
  