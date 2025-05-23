import defaultInput from '@/config/const/input';
import defaultSelect from '@/config/const/select';
import defaultRadioBtns from '@/config/const/radio_btns';
import defaultTextarea from '@/config/const/textarea';
import defaultNumber from '@/config/const/number';
import defaultDate from '@/config/const/date';
import defaultDateGroup from '@/config/const/date-group';
import defaultCheckbox from '@/config/const/checkbox';
import defaultSelectMulti from '@/config/const/select_multi';
import defaultPosition from '@/config/const/position';
import defaultRichText from '@/config/const/rich_text';
import defaultAddress from '@/config/const/address';
import defaultPhone from '@/config/const/phone';
import defaultPwd from '@/config/const/pwd';
import defaultScore from '@/config/const/score'
// 系统设置
interface DefaultSettings {
    single_text: object;
    select: object;
    radio_btns: object;
    multi_text: object;
    number: object;
    date: object;
    date_group: object;
    checkbox: object;
    select_multi: object;
    position: object;
    rich_text: object;
    address: object;
    phone: object;
    pwd: object;
    score: object;
}

const defaultSettings: DefaultSettings = {
    single_text: defaultInput,
    select: defaultSelect,
    radio_btns: defaultRadioBtns,
    multi_text: defaultTextarea,
    number: defaultNumber,
    date: defaultDate,
    date_group: defaultDateGroup,
    checkbox: defaultCheckbox,
    select_multi: defaultSelectMulti,
    position: defaultPosition,
    rich_text: defaultRichText,
    address: defaultAddress,
    phone: defaultPhone,
    pwd: defaultPwd,
    score: defaultScore
};

export default defaultSettings;
