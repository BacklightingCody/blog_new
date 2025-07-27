export const BASEURL = 'http://localhost:8080';
// export const BASEURL = 'http://49.233.6.157:80/v1/chat/completions';
export const PATH = '/openApi/docsChat';
export const aikeys = '01JP7D7CBR57AJ8DE1X8M28ZX9';
// export const hunyuanUrl = 'hunyuan.tencentcloudapi.com'

export interface Models {
  label: string;
  value: string;
  supportsImage: boolean;
}

export const MODELS = [
  { label: 'hunyuan-t1-latest', value: 'hunyuan-t1-latest', supportsImage: false },
  {
    label: 'DeepSeek-R1-Online-64K',
    value: 'DeepSeek-R1-Online-64K',
    supportsImage: false
  },
  {
    label: 'DeepSeek-R1-Online-128K',
    value: 'DeepSeek-R1-Online-128K',
    supportsImage: false
  },
  {
    label: 'DeepSeek-R1-Online-0120',
    value: 'DeepSeek-R1-Online-0120',
    supportsImage: false
  },
  {
    label: 'hunyuan-translation',
    value: 'hunyuan-translation',
    supportsImage: false
  },
  {
    label: 'hunyuan-t1-vision-preview',
    value: 'hunyuan-t1-vision-preview',
    supportsImage: true
  },
  {
    label: 'hunyuan-turbos-latest',
    value: 'hunyuan-turbos-latest',
    supportsImage: false
  },
  {
    label: 'hunyuan-turbos-vision',
    value: 'hunyuan-turbos-vision',
    supportsImage: true
  },
  { label: 'hunyuan-ocr', value: 'hunyuan-ocr', supportsImage: true },
  {
    label: 'Qwen2.5-VL-72B-Instruct',
    value: '/cfs/models/Qwen2.5-VL-72B-Instruct/',
    supportsImage: true
  },
  {
    label: 'Kimi-K2-Instruct-Online-32K',
    value: 'Kimi-K2-Instruct-Online-32K',
    supportsImage: true
  }
];

export const DEFAULT_MODEL_PARAMS = {
  model: 'hunyuan-t1-latest',
  temperature: 0.5,
  topK: 40
};
