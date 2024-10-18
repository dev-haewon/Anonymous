import $, { Cash } from 'cash-dom';
import Awesomplete from 'awesomplete';
import data from '../public/mgalleryDB.json';

class AutocompleteManager {
    private searchInput: HTMLInputElement;
    private awesomplete: Awesomplete;
    private searchType: Cash;

    constructor() {
        this.searchInput = $('#search')[0] as HTMLInputElement;
        this.awesomplete = new Awesomplete(this.searchInput, { minChars: 1 });
        this.searchType = $('#search-type');
        this.setupAutocomplete();
    }

    private setupAutocomplete() {
        this.searchType.on('change', this.updateList.bind(this));
        this.updateList();
    }

    private updateList() {
        const searchType = this.searchType.val() as string;
        const items =
            searchType === 'id' ? Object.values(data) : Object.keys(data);
        this.searchInput.value = '';
        this.awesomplete.list = items;
    }
}

class SideNavManager {
    private sideNav: Cash;
    private main: Cash;
    private more: Cash;
    private closeBtn: Cash;
    private isOpen = false;

    constructor() {
        this.sideNav = $('#sideNav');
        this.main = $('main');
        this.more = $('#more');
        this.closeBtn = $('button.close');
        this.setupSideNav();
    }

    private setupSideNav() {
        this.more.on('click', (e: MouseEvent) => this.toggleSideNav(e));
        this.closeBtn.on('click', () => this.closeSideNav());
    }

    private toggleSideNav(e: MouseEvent) {
        e.stopPropagation();
        if (this.isOpen) {
            this.closeSideNav();
        } else {
            this.openSideNav();
        }
    }

    private openSideNav() {
        this.sideNav.addClass('open');
        this.main.addClass('dimmed');
        this.isOpen = true;
        $(document).on('click.outside', this.handleOutsideClick.bind(this));
    }

    private closeSideNav() {
        this.sideNav.removeClass('open');
        this.main.removeClass('dimmed');
        this.isOpen = false;
        $(document).off('click.outside');
    }

    private handleOutsideClick(e: MouseEvent) {
        if (
            !this.sideNav.is(e.target as HTMLElement) &&
            this.sideNav.has(e.target as HTMLElement).length === 0 &&
            !this.more.is(e.target as HTMLElement)
        ) {
            this.closeSideNav();
        }
    }
}

class PauseResumeManager {
    private pause: Cash;
    private resume: Cash;
    private isPaused = false;

    constructor() {
        this.pause = $('#pause');
        this.resume = $('#resume');
        this.setupPauseResume();
    }

    private setupPauseResume() {
        this.pause.on('click', (e: MouseEvent) => this.togglePause(e));
        this.resume.on('click', (e: MouseEvent) => this.togglePause(e));
    }

    private togglePause(e: MouseEvent) {
        e.stopPropagation();
        this.isPaused = !this.isPaused;
        this.updateUI();
    }

    private updateUI() {
        if (this.isPaused) {
            this.pause.hide();
            this.resume.show();
        } else {
            this.resume.hide();
            this.pause.show();
        }
    }
}

class DropdownManager {
    constructor() {
        this.setupDropdown();
    }

    private setupDropdown() {
        $('.dropdown-btn').on('click', this.toggleDropdown.bind(this));
    }

    private toggleDropdown(e: MouseEvent) {
        e.stopPropagation();
        const $dropdownContent = $(e.currentTarget as HTMLElement).next(
            '.dropdown-content'
        );

        if ($dropdownContent.hasClass('open')) {
            this.closeDropdown($dropdownContent);
        } else {
            $('.dropdown-content.open').each((_, el) =>
                this.closeDropdown($(el))
            );
            this.openDropdown($dropdownContent);
        }
    }

    private openDropdown($dropdownContent: Cash) {
        $dropdownContent.addClass('open').css({
            maxHeight: '250px',
            paddingBottom: '250px',
        });
    }

    private closeDropdown($dropdownContent: Cash) {
        $dropdownContent.removeClass('open').css({
            maxHeight: '0',
            paddingBottom: '0',
        });
    }
}

class ToggleManager {
    constructor(private elements: ToggleableElement[]) {
        this.setupToggleCheckboxes();
    }

    private setupToggleCheckboxes() {
        this.elements.forEach((element) => {
            element.checkbox.on('change', () => {
                const isChecked = element.checkbox.is(':checked');
                element.checkbox.css(
                    '--tglbg',
                    isChecked ? '#fcac23' : '#f0f0f0'
                );
                element.icon.toggle(!isChecked);
            });
        });
    }
}

class MemoManager {
    constructor() {
        this.setupMemo();
    }

    private setupMemo() {
        $('#memoSelect span').on('click', this.selectMemo.bind(this));
    }

    private selectMemo(e: MouseEvent) {
        const $target = $(e.currentTarget as HTMLElement);
        $target.addClass('selected');
        $('#memoSelect span').not($target).removeClass('selected');
    }

    public addMemo($node: Cash) {
        const $list = $node.find('.memoTable');
        // Further memo adding logic...
    }
}

interface ToggleableElement {
    checkbox: Cash;
    icon: Cash;
}

// 인스턴스 생성 및 초기화
new AutocompleteManager();
new SideNavManager();
new PauseResumeManager();
new DropdownManager();
new ToggleManager([
    {
        checkbox: $('input[type="checkbox"]', '#preview'),
        icon: $('i', '#preview'),
    },
    {
        checkbox: $('input[type="checkbox"]', '#user-info'),
        icon: $('i', '#user-info'),
    },
    {
        checkbox: $('input[type="checkbox"]', '#user-tag'),
        icon: $('i', '#user-tag'),
    },
    {
        checkbox: $('input[type="checkbox"]', '#auto-navigation'),
        icon: $('i', '#auto-navigation'),
    },
    {
        checkbox: $('input[type="checkbox"]', '#admin-panel'),
        icon: $('i', '#admin-panel'),
    },
]);
new MemoManager();
