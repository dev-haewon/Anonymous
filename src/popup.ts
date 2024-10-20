import $, { Cash } from 'cash-dom';
import Awesomplete from 'awesomplete';
import data from '../public/mgalleryDB.json';

class HeaderGUI {
    constructor() {
        this.setupAutocomplete();
        this.setupSideNav();
        this.setupPauseResume();
        this.setupDropdown();
        this.setupToggleCheckboxes();
        this.setupMemo();
        this.addMemo('user');
    }

    /**
     * 검색어 자동완성 설정
     */
    private setupAutocomplete() {
        const searchInput = $('#search')[0] as HTMLInputElement;
        const searchType = $('#search-type');
        const awesomplete = new Awesomplete(searchInput, { minChars: 1 });

        // 검색어 리스트 업데이트
        function updateList() {
            const items =
                searchType.val() === 'id'
                    ? Object.values(data)
                    : Object.keys(data);
            searchInput.value = '';
            awesomplete.list = items;
        }

        searchType.on('change', updateList);
        updateList();
    }

    /**
     * 사이드바 설정
     */
    private setupSideNav() {
        const sideNav = $('#sideNav');
        const main = $('main');
        const more = $('#more');
        const closeBtn = $('button.close');
        let isOpen = false;

        // 사이드바 여는 함수
        function openSideNav() {
            sideNav.addClass('open');
            main.addClass('dimmed');
            isOpen = true;
            $(document).on('click.outside', handleOutsideClick);
        }

        // 사이드바 닫는 함수
        function closeSideNav() {
            sideNav.removeClass('open');
            main.removeClass('dimmed');
            isOpen = false;
            $(document).off('click.outside');
        }

        // 사이드바 여닫는 토글
        function toggleSideNav(e: MouseEvent) {
            e.stopPropagation();
            isOpen ? closeSideNav() : openSideNav();
        }

        // 사이드바 외부 클릭 이벤트 핸들러
        function handleOutsideClick(e: MouseEvent) {
            if (
                !sideNav.is(e.target as HTMLElement) &&
                sideNav.has(e.target as HTMLElement).length === 0 &&
                !more.is(e.target as HTMLElement)
            ) {
                closeSideNav();
            }
        }

        more.on('click', toggleSideNav);
        closeBtn.on('click', closeSideNav);
    }

    /**
     * 일시정지/재개 설정
     */
    private setupPauseResume() {
        const pause = $('#pause');
        const resume = $('#resume');
        let isPaused = false;

        // 일시정지 토글
        function togglePause(e: MouseEvent) {
            e.stopPropagation();
            isPaused = !isPaused;
            updateUI();
        }

        // UI 업데이트
        function updateUI() {
            if (isPaused) {
                pause.hide();
                resume.show();
            } else {
                resume.hide();
                pause.show();
            }
        }

        pause.on('click', togglePause);
        resume.on('click', togglePause);
    }

    /**
     * 드롭다운 설정
     */
    private setupDropdown() {
        // 드롭다운 여닫는 토글 함수
        function toggleDropdown(e: MouseEvent) {
            e.preventDefault();
            const $dropdownContent = $(e.currentTarget as HTMLElement).next(
                '.dropdown-content'
            );

            if ($dropdownContent.hasClass('open')) {
                closeDropdown($dropdownContent);
            } else {
                $('.dropdown-content.open').each((_, el) =>
                    closeDropdown($(el))
                );
                openDropdown($dropdownContent);
            }
        }

        // 드롭다운 여는 함수
        function openDropdown($dropdownContent: Cash) {
            $dropdownContent.addClass('open').css({
                maxHeight: '250px',
                paddingBottom: '250px',
            });
        }

        // 드롭다운 닫는 함수
        function closeDropdown($dropdownContent: Cash) {
            $dropdownContent.removeClass('open').css({
                maxHeight: '0',
                paddingBottom: '0',
            });
        }

        $('.dropdown-btn').on('click', toggleDropdown);
    }

    /**
     * 토글 체크박스들 설정
     */
    private setupToggleCheckboxes() {
        // 토글 체크박스 요소들
        const elements = [
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
        ];

        elements.forEach(({ checkbox, icon }) => {
            checkbox.on('change', () => {
                const isChecked = checkbox.is(':checked');
                checkbox.css('--tglbg', isChecked ? '#fcac23' : '#f0f0f0');
                icon.toggle(!isChecked);
            });
        });
    }

    /**
     * 메모 설정
     */
    private setupMemo() {
        $('#memoSelect span').on('click', function () {
            $('#memoTable tbody').hide();
            $(this).addClass('selected');

            const target = $(this).data('target');
            $(`#memoTable tbody[data-target="${target}"]`).show();
            $('#memoSelect span').not(this).removeClass('selected');
        });
    }

    /**
     * 메모 추가
     */
    private addMemo(data: string) {
        const $tbody = $(`#memoTable tbody[data-target="${data}"]`);
        const $newMemo = $('#forCloneMemo tr').clone();
        $newMemo.appendTo($tbody);
        this.bindMemoEvents($newMemo, data);
        // 새로운 메모를 추가하기 전에 기존의 메모가 추가되었는지 확인
        // const existingMemoCount = $tbody.find('tr').length;

        // 메모가 이미 존재하지 않는 경우에만 추가
        // if (existingMemoCount === 0) {
        //     $clonedTarget.appendTo($tbody);
        // } else {
        //     // 필요한 경우 기존의 메모에 추가하는 로직을 작성할 수 있습니다.
        // }
        // this.bindMemoEvents();
    }

    /**
     * 메모 입력 이벤트 바인딩
     */
    private bindMemoEvents($memo: Cash, data: string) {
        const self = this;
        const $inputs = $memo.find('input');

        $inputs.on('input', function () {
            const $tr = $(this).closest('tr');
            const $keyInput = $tr.find('.key').val();
            const $valueInput = $tr.find('.value').val();
            const allFilled = $keyInput !== '' && $valueInput !== '';
            const selfIndex = $tr.index() + 1;
            const memoLength = $(this).closest('tbody').find('tr').length;
            console.log(selfIndex, memoLength);
            const isLastMemo = selfIndex === memoLength;
            if (allFilled && isLastMemo) self.addMemo(data);
        });
    }
    // private bindMemoEvents() {
    //     const self = this;

    //     // 모든 td > input 요소에 대해 이벤트 바인딩을 한 번만 수행
    //     $('#memoTable').on('keyup', function (e) {
    //         e.preventDefault();

    //         const $form = $(this);
    //         const $tbody = $form.closest('tbody');
    //         const data = $tbody.data('target');

    //         // 모든 input 요소가 채워졌는지 확인
    //         const allFilled =
    //             $form.find('input').filter(function () {
    //                 return $(this).val() === '';
    //             }).length === 0;

    //         if (allFilled) {
    //             self.addMemo(data);
    //             // 폼 초기화
    //             $form.find('input').val('');
    //         }
    //     });
    // }
}

// 인스턴스 생성 및 초기화
new HeaderGUI();
