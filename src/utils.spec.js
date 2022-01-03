import { Cursor } from 'utils';
import { ArrowKeysHandler } from 'utils';
import data from './data/HelpTOC.json';

const topLevelIds = data.topLevelIds;

const imitationStoreData = {
    currentId: null,
    activePages: [],
};

describe('Cursor tests', () => {
    const pageList = data;
    const pages = pageList.entities.pages;
    const activePages = [
        'top',
        'procedures.workingwithprojects.config.template',
        'concepts.module.path',
        'Working_with_source_code',
        'd732e166',
        'd732e254',
        'procedures.vcWithIDEA',
        'd732e375',
        'd732e380',
        'd732e1056',
        'd732e1069',
    ];
    const myCursor = (currentId, activePages) => new Cursor(pageList, pages, currentId, activePages);

    topLevelIds.map((topId, i) => {
        it('Cursor`s getDownDirection has worked: for non-nested Ids', () => {
            expect(i === topLevelIds.length - 1 ? topLevelIds[0] : topLevelIds[i + 1]).toBe(
                myCursor(topId, []).getDownDirection()
            );
        });
        it('Cursor`s getUpDirection have worked: for non-nested Ids', () => {
            expect(i === 0 ? topLevelIds[topLevelIds.length - 1] : topLevelIds[i - 1]).toBe(
                myCursor(topId, []).getUpDirection()
            );
        });

        it('Cursor`s getDownDirection has worked: for nested Ids', () => {
            const getExpectedValueDown = (id, index) => {
                if (activePages.includes(id)) {
                    return pages[id].pages[0];
                } else if (!activePages.includes(id) && index === topLevelIds.length - 1) {
                    return topLevelIds[0];
                } else {
                    return topLevelIds[i + 1];
                }
            };

            expect(getExpectedValueDown(topId, i)).toBe(myCursor(topId, activePages).getDownDirection());
        });
    });

    it('Cursor`s getDownDirection and getUpDirection have worked: for one exact Id', () => {
        const thisCaseActivePages = ['concepts.module.path', 'concepts.module.contents'];

        expect('preferences.jdks').toBe(
            myCursor('Unloading_Modules', thisCaseActivePages).getDownDirection()
        );
        expect('Unloading_Modules').toBe(
            myCursor('preferences.jdks', thisCaseActivePages).getUpDirection()
        );

        expect('Working_with_source_code').toBe(
            myCursor('concepts.module.libraries', thisCaseActivePages).getDownDirection()
        );
        expect('concepts.module.libraries').toBe(
            myCursor('Working_with_source_code', thisCaseActivePages).getUpDirection()
        );
    });

    it('Cursor getMoveCursorRight have worked', () => {
        const setCurrentId = (id) => (imitationStoreData.currentId = id);
        const setActivePage = (id) => imitationStoreData.activePages.push(id);
        const isNested = (id) => pages[id].pages && pages[id].pages.length > 0;

        const myCursorRightHandler = () => {
            const cursor = new ArrowKeysHandler(
                pageList,
                pages,
                'top',
                imitationStoreData.activePages,
                setCurrentId,
                setActivePage,
                isNested
            );
            cursor.getMoveCursorRight();
            return {
                currentId: imitationStoreData.currentId,
                activePages: imitationStoreData.activePages,
            };
        };

        expect('Install_and_set_up__product_').toBe(myCursorRightHandler().currentId);
        expect('top').toBe(myCursorRightHandler().activePages[0]);
    });
});
