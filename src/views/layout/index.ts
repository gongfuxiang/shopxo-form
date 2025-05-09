import defaultInput from '@/config/const/input';
import defaultSelect from '@/config/const/select';
import defaultRadioBtns from '@/config/const/radio_btns';
import defaultTextarea from '@/config/const/textarea';
import defaultNumber from '@/config/const/number';

// 系统设置
interface DefaultSettings {
    single_text: object;
    select: object;
    radio_btns: object;
    multi_text: object;
    number: object;
}

const defaultSettings: DefaultSettings = {
    single_text: defaultInput,
    select: defaultSelect,
    radio_btns: defaultRadioBtns,
    multi_text: defaultTextarea,
    number: defaultNumber,
};

export default defaultSettings;
