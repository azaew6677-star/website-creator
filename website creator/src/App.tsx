import { useState, useMemo } from 'react';

// Типы данных
interface Material {
  id: string;
  name: string;
  unit: string;
  pricePerUnit: number;
  category: string;
  description: string;
}

interface EstimateItem {
  id: string;
  materialId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes: string;
}

interface ProjectInfo {
  name: string;
  address: string;
  customer: string;
  date: string;
  currency: string;
}

// База материалов
const materialsDatabase: Material[] = [
  // Фундамент
  { id: 'm1', name: 'Бетон М300', unit: 'м³', pricePerUnit: 8500, category: 'Фундамент', description: 'Бетон для монолитного фундамента' },
  { id: 'm2', name: 'Арматура 12мм', unit: 'тонна', pricePerUnit: 52000, category: 'Фундамент', description: 'Стальная арматура для армирования' },
  { id: 'm3', name: 'Фундаментная плита', unit: 'м²', pricePerUnit: 4500, category: 'Фундамент', description: 'Монолитная плита 200мм' },
  { id: 'm4', name: 'Опалубка', unit: 'м²', pricePerUnit: 850, category: 'Фундамент', description: 'Деревянная опалубка' },
  { id: 'm5', name: 'Гравий', unit: 'м³', pricePerUnit: 2200, category: 'Фундамент', description: 'Подушка из гравия' },
  
  // Стены
  { id: 'm6', name: 'Кирпич керамический', unit: 'тыс. шт', pricePerUnit: 8500, category: 'Стены', description: 'Кирпич 250x120x65 мм' },
  { id: 'm7', name: 'Блок газобетон 300мм', unit: 'м³', pricePerUnit: 7200, category: 'Стены', description: 'Газобетонные блоки' },
  { id: 'm8', name: 'Блок газобетон 400мм', unit: 'м³', pricePerUnit: 9500, category: 'Стены', description: 'Газобетонные блоки' },
  { id: 'm9', name: 'Цементный раствор', unit: 'м³', pricePerUnit: 12000, category: 'Стены', description: 'Мasonry раствор М100' },
  { id: 'm10', name: 'Штробление стен', unit: 'м', pricePerUnit: 450, category: 'Стены', description: 'Штробление под проводку' },
  
  // Перекрытия
  { id: 'm11', name: 'Железобетонные плиты', unit: 'м²', pricePerUnit: 2800, category: 'Перекрытия', description: 'Плиты перекрытия 200мм' },
  { id: 'm12', name: 'Утепление перекрытия', unit: 'м²', pricePerUnit: 650, category: 'Перекрытия', description: 'Минвата 100мм' },
  { id: 'm13', name: 'Пенополистирол', unit: 'м²', pricePerUnit: 380, category: 'Перекрытия', description: 'Пенополистирол 50мм' },
  
  // Кровля
  { id: 'm14', name: 'Металлочерепица', unit: 'м²', pricePerUnit: 950, category: 'Кровля', description: 'Профнастил с покрытием' },
  { id: 'm15', name: 'Снегозадержатели', unit: 'м', pricePerUnit: 280, category: 'Кровля', description: 'Снегозадержатели' },
  { id: 'm16', name: 'Водосточная система', unit: 'м', pricePerUnit: 450, category: 'Кровля', description: 'ПВХ водостоки' },
  { id: 'm17', name: 'Ферма металлическая', unit: 'м', pricePerUnit: 1200, category: 'Кровля', description: 'Металлические фермы' },
  
  // Окна и двери
  { id: 'm18', name: 'Окно ПВХ 1000x1400', unit: 'шт', pricePerUnit: 18500, category: 'Окна и двери', description: 'Двухкамерный стеклопакет' },
  { id: 'm19', name: 'Окно ПВХ 1200x1400', unit: 'шт', pricePerUnit: 22000, category: 'Окна и двери', description: 'Двухкамерный стеклопакет' },
  { id: 'm20', name: 'Окно ПВХ 1500x1500', unit: 'шт', pricePerUnit: 28000, category: 'Окна и двери', description: 'Двухкамерный стеклопакет' },
  { id: 'm21', name: 'Входная дверь металлическая', unit: 'шт', pricePerUnit: 35000, category: 'Окна и двери', description: 'Дверь с замком' },
  { id: 'm22', name: 'Внутренняя дверь', unit: 'шт', pricePerUnit: 12000, category: 'Окна и двери', description: 'Дверь межкомнатная' },
  { id: 'm23', name: 'Дверной проём', unit: 'шт', pricePerUnit: 4500, category: 'Окна и двери', description: 'Установка проёма' },
  
  // Отопление и водоснабжение
  { id: 'm24', name: 'Труба отопления медная', unit: 'м', pricePerUnit: 1800, category: 'Отопление', description: 'Медная труба 15мм' },
  { id: 'm25', name: 'Труба отопления стальная', unit: 'м', pricePerUnit: 650, category: 'Отопление', description: 'Стальная труба 25мм' },
  { id: 'm26', name: 'Радиатор алюминиевый', unit: 'шт', pricePerUnit: 8500, category: 'Отопление', description: 'Радиатор 500мм' },
  { id: 'm27', name: 'Бойлер электрический', unit: 'шт', pricePerUnit: 22000, category: 'Отопление', description: 'Бойлер 150л' },
  { id: 'm28', name: 'Насос циркуляционный', unit: 'шт', pricePerUnit: 4500, category: 'Отопление', description: 'Циркуляционный насос' },
  { id: 'm29', name: 'Труба водоснабжения ПНД', unit: 'м', pricePerUnit: 280, category: 'Водоснабжение', description: 'ПНД труба 20мм' },
  { id: 'm30', name: 'Счётчик воды', unit: 'шт', pricePerUnit: 3500, category: 'Водоснабжение', description: 'Счётчик холодной воды' },
  { id: 'm31', name: 'Сантехника унитаз', unit: 'шт', pricePerUnit: 15000, category: 'Водоснабжение', description: 'Унитаз с сиденьем' },
  { id: 'm32', name: 'Ванна чугунная', unit: 'шт', pricePerUnit: 28000, category: 'Водоснабжение', description: 'Чугунная ванна' },
  { id: 'm33', name: 'Раковина', unit: 'шт', pricePerUnit: 8500, category: 'Водоснабжение', description: 'Раковина напольная' },
  
  // Электрика
  { id: 'm34', name: 'Кабель ВВГ 2.5', unit: 'м', pricePerUnit: 45, category: 'Электрика', description: 'Кабель медный 2.5мм²' },
  { id: 'm35', name: 'Кабель ВВГ 4', unit: 'м', pricePerUnit: 75, category: 'Электрика', description: 'Кабель медный 4мм²' },
  { id: 'm36', name: 'Розетка', unit: 'шт', pricePerUnit: 450, category: 'Электрика', description: 'Розетка двойная' },
  { id: 'm37', name: 'Выключатель', unit: 'шт', pricePerUnit: 350, category: 'Электрика', description: 'Выключатель одинарный' },
  { id: 'm38', name: 'Автомат защиты', unit: 'шт', pricePerUnit: 280, category: 'Электрика', description: 'Автомат 16А' },
  { id: 'm39', name: 'Коробок подрозетник', unit: 'шт', pricePerUnit: 120, category: 'Электрика', description: 'Подрозетник' },
  { id: 'm40', name: 'Щиток электрощиток', unit: 'шт', pricePerUnit: 8500, category: 'Электрика', description: 'Распределительный щиток' },
  
  // Отделка
  { id: 'm41', name: 'Гипсокартон', unit: 'м²', pricePerUnit: 1200, category: 'Отделка', description: 'ГКЛ 12.5мм' },
  { id: 'm42', name: 'Гипсоволокно', unit: 'м²', pricePerUnit: 1800, category: 'Отделка', description: 'ГВЛ 12мм' },
  { id: 'm43', name: 'Плитка керамическая', unit: 'м²', pricePerUnit: 2800, category: 'Отделка', description: 'Керамическая плитка' },
  { id: 'm44', name: 'Керамогранит', unit: 'м²', pricePerUnit: 3500, category: 'Отделка', description: 'Керамогранит 300x600' },
  { id: 'm45', name: 'Ламинат', unit: 'м²', pricePerUnit: 1200, category: 'Отделка', description: 'Ламинат 32 класс' },
  { id: 'm46', name: 'Паркет', unit: 'м²', pricePerUnit: 4500, category: 'Отделка', description: 'Паркет натуральный' },
  { id: 'm47', name: 'Краска акриловая', unit: 'литр', pricePerUnit: 850, category: 'Отделка', description: 'Акриловая краска' },
  { id: 'm48', name: 'Обои', unit: 'м²', pricePerUnit: 450, category: 'Отделка', description: 'Обои виниловые' },
  { id: 'm49', name: 'Потолок натяжной', unit: 'м²', pricePerUnit: 1800, category: 'Отделка', description: 'Потолок ПВХ' },
  { id: 'm50', name: 'Потолок из гипсокартона', unit: 'м²', pricePerUnit: 2200, category: 'Отделка', description: 'Подвесной потолок' },
  
  // Инженерные работы
  { id: 'm51', name: 'Проектирование', unit: 'м²', pricePerUnit: 1500, category: 'Работы', description: 'Проектирование buildings' },
  { id: 'm52', name: 'Разрушение стен', unit: 'м²', pricePerUnit: 1200, category: 'Работы', description: 'Демонтаж перегородок' },
  { id: 'm53', name: 'Штукатурка', unit: 'м²', pricePerUnit: 850, category: 'Работы', description: 'Штукатурка стен' },
  { id: 'm54', name: 'Покраска', unit: 'м²', pricePerUnit: 450, category: 'Работы', description: 'Окраска стен' },
  { id: 'm55', name: 'Укладка плитки', unit: 'м²', pricePerUnit: 1800, category: 'Работы', description: 'Укладка керамической плитки' },
  { id: 'm56', name: 'Укладка ламината', unit: 'м²', pricePerUnit: 650, category: 'Работы', description: 'Укладка ламината' },
  { id: 'm57', name: 'Монтаж окон', unit: 'шт', pricePerUnit: 2500, category: 'Работы', description: 'Установка окон' },
  { id: 'm58', name: 'Монтаж дверей', unit: 'шт', pricePerUnit: 1800, category: 'Работы', description: 'Установка дверей' },
  { id: 'm59', name: 'Монтаж радиаторов', unit: 'шт', pricePerUnit: 1500, category: 'Работы', description: 'Установка радиаторов' },
  { id: 'm60', name: 'Монтаж сантехники', unit: 'шт', pricePerUnit: 2200, category: 'Работы', description: 'Установка сантехники' },
  { id: 'm61', name: 'Электромонтаж', unit: 'м²', pricePerUnit: 1200, category: 'Работы', description: 'Электромонтаж buildings' },
  { id: 'm62', name: 'Пусконаладка', unit: 'проект', pricePerUnit: 15000, category: 'Работы', description: 'Пусконаладочные работы' },
];

const categories = ['Все', ...Array.from(new Set(materialsDatabase.map(m => m.category)))];

const generateId = () => Math.random().toString(36).substr(2, 9);

export function App() {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Новый проект',
    address: '',
    customer: '',
    date: new Date().toISOString().split('T')[0],
    currency: '₽',
  });
  
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация материалов
  const filteredMaterials = useMemo(() => {
    return materialsDatabase.filter(m => {
      const matchesCategory = selectedCategory === 'Все' || m.category === selectedCategory;
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Расчёты
  const calculations = useMemo(() => {
    const materialsTotal = estimateItems.reduce((sum, item) => sum + item.total, 0);
    const materialsCount = estimateItems.length;
    const materialsCost = estimateItems.filter(i => materialsDatabase.find(m => m.id === i.materialId)?.category === 'Работы').reduce((sum, item) => sum + item.total, 0);
    const worksCost = estimateItems.filter(i => materialsDatabase.find(m => m.id === i.materialId)?.category === 'Работы').reduce((sum, item) => sum + item.total, 0);
    const materialsCostOnly = materialsTotal - worksCost;
    
    return {
      materialsTotal,
      materialsCount,
      materialsCost,
      worksCost,
      materialsCostOnly,
      totalWithOverhead: materialsTotal * 1.1,
      totalWithProfit: materialsTotal * 1.15,
    };
  }, [estimateItems]);

  // Добавление материала в смету
  const addToEstimate = (material: Material) => {
    const existingItem = estimateItems.find(item => item.materialId === material.id);
    
    if (existingItem) {
      setEstimateItems(prev => prev.map(item => 
        item.materialId === material.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: EstimateItem = {
        id: generateId(),
        materialId: material.id,
        quantity: 1,
        unitPrice: material.pricePerUnit,
        total: material.pricePerUnit,
        notes: '',
      };
      setEstimateItems(prev => [...prev, newItem]);
    }
  };

  // Обновление количества
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromEstimate(id);
      return;
    }
    
    setEstimateItems(prev => prev.map(item => {
      if (item.id === id) {
        const material = materialsDatabase.find(m => m.id === item.materialId);
        return {
          ...item,
          quantity,
          total: quantity * (material?.pricePerUnit || item.unitPrice),
        };
      }
      return item;
    }));
  };

  // Обновление примечаний
  const updateNotes = (id: string, notes: string) => {
    setEstimateItems(prev => prev.map(item =>
      item.id === id ? { ...item, notes } : item
    ));
  };

  // Удаление из сметы
  const removeFromEstimate = (id: string) => {
    setEstimateItems(prev => prev.filter(item => item.id !== id));
  };

  // Экспорт в PDF/HTML
  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Смета - ${projectInfo.name}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .info { background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .info p { margin: 5px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
    th { background: #3b82f6; color: white; }
    .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; background: #f8fafc; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📋 Смета на строительство</h1>
  <div class="info">
    <p><strong>Проект:</strong> ${projectInfo.name}</p>
    <p><strong>Адрес:</strong> ${projectInfo.address || 'Не указан'}</p>
    <p><strong>Заказчик:</strong> ${projectInfo.customer || 'Не указан'}</p>
    <p><strong>Дата:</strong> ${projectInfo.date}</p>
  </div>
  
  <table>
    <thead>
      <tr>
        <th>№</th>
        <th>Наименование</th>
        <th>Ед. изм.</th>
        <th>Кол-во</th>
        <th>Цена</th>
        <th>Сумма</th>
      </tr>
    </thead>
    <tbody>
      ${estimateItems.map((item, index) => {
        const material = materialsDatabase.find(m => m.id === item.materialId);
        return `
      <tr>
        <td>${index + 1}</td>
        <td>${material?.name || 'Неизвестный материал'}</td>
        <td>${material?.unit || '-'}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice.toLocaleString()} ${projectInfo.currency}</td>
        <td>${item.total.toLocaleString()} ${projectInfo.currency}</td>
      </tr>`;
      }).join('')}
    </tbody>
  </table>
  
  <div class="total">
    ИТОГО: ${calculations.materialsTotal.toLocaleString()} ${projectInfo.currency}
  </div>
  
  <div class="footer">
    <p>Создано в конструкторе строительных смет</p>
    <p>Всего позиций: ${calculations.materialsCount}</p>
  </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `смета-${projectInfo.name.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Очистка сметы
  const clearEstimate = () => {
    if (confirm('Вы уверены, что хотите очистить смету?')) {
      setEstimateItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Шапка */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏗️</span>
              <div>
                <h1 className="text-2xl font-bold">Конструктор строительных смет</h1>
                <p className="text-blue-200 text-sm">Профессиональное ценообразование</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToHTML}
                disabled={estimateItems.length === 0}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                📥 Экспорт HTML
              </button>
              <button
                onClick={clearEstimate}
                disabled={estimateItems.length === 0}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️ Очистить
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Информация о проекте */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span>📁</span> Информация о проекте
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Название проекта</label>
              <input
                type="text"
                value={projectInfo.name}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Адрес объекта</label>
              <input
                type="text"
                value={projectInfo.address}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Город, улица, дом"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Заказчик</label>
              <input
                type="text"
                value={projectInfo.customer}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, customer: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Дата</label>
              <input
                type="date"
                value={projectInfo.date}
                onChange={(e) => setProjectInfo(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* База материалов */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span>📦</span> База материалов
                </h2>
                <span className="text-sm text-slate-500">{filteredMaterials.length} материалов</span>
              </div>
              
              {/* Поиск */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск материалов..."
                  className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              </div>
              
              {/* Категории */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Список материалов */}
            <div className="max-h-96 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMaterials.map(material => (
                  <div
                    key={material.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => addToEstimate(material)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-slate-800 group-hover:text-blue-600">{material.name}</h3>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{material.category}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{material.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{material.unit}</span>
                      <span className="text-lg font-bold text-blue-600">
                        {material.pricePerUnit.toLocaleString()} ₽
                      </span>
                    </div>
                    <button className="mt-2 w-full py-1.5 bg-blue-50 text-blue-600 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      + Добавить в смету
                    </button>
                  </div>
                ))}
              </div>
              
              {filteredMaterials.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-2">📭</span>
                  <p>Материалы не найдены</p>
                </div>
              )}
            </div>
          </div>

          {/* Суммарная информация */}
          <div className="space-y-6">
            {/* Итоговая информация */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-md p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Итоговая информация
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Позиций в смете</span>
                  <span className="font-bold text-xl">{calculations.materialsCount}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Стоимость материалов</span>
                  <span className="font-bold">{calculations.materialsCostOnly.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-blue-400">
                  <span className="text-blue-100">Стоимость работ</span>
                  <span className="font-bold">{calculations.worksCost.toLocaleString()} ₽</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-white/10 rounded-lg px-3 mt-4">
                  <span className="font-semibold">ИТОГО:</span>
                  <span className="font-bold text-2xl">{calculations.materialsTotal.toLocaleString()} ₽</span>
                </div>
                
                <div className="pt-2 space-y-2 text-sm">
                  <div className="flex justify-between text-blue-100">
                    <span>С наценкой 10%:</span>
                    <span>{calculations.totalWithOverhead.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-blue-100">
                    <span>С прибылью 15%:</span>
                    <span>{calculations.totalWithProfit.toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Статистика по категориям */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span>📈</span> По категориям
              </h2>
              <div className="space-y-3">
                {categories.slice(1).map(cat => {
                  const catTotal = estimateItems
                    .filter(item => materialsDatabase.find(m => m.id === item.materialId)?.category === cat)
                    .reduce((sum, item) => sum + item.total, 0);
                  const maxTotal = Math.max(...categories.slice(1).map(c => 
                    estimateItems
                      .filter(item => materialsDatabase.find(m => m.id === item.materialId)?.category === c)
                      .reduce((sum, item) => sum + item.total, 0)
                  ), 1);
                  const percentage = (catTotal / maxTotal) * 100;
                  
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{cat}</span>
                        <span className="font-medium text-slate-800">{catTotal.toLocaleString()} ₽</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Таблица сметы */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span>📋</span> Смета
            </h2>
            <span className="text-sm text-slate-500">{estimateItems.length} позиций</span>
          </div>
          
          {estimateItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <span className="text-6xl block mb-4">📝</span>
              <p className="text-lg font-medium">Смета пуста</p>
              <p className="text-sm mt-2">Нажмите на материал для добавления в смету</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">№</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Наименование</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Категория</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Ед. изм.</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Кол-во</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Цена</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-600">Сумма</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Примечания</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {estimateItems.map((item, index) => {
                    const material = materialsDatabase.find(m => m.id === item.materialId);
                    return (
                      <tr 
                        key={item.id} 
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{material?.name}</div>
                          <div className="text-xs text-slate-500">{material?.description}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                            {material?.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600">{material?.unit}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 0)}
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="0.1"
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-slate-600">
                          {item.unitPrice.toLocaleString()} ₽
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-600">
                          {item.total.toLocaleString()} ₽
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => updateNotes(item.id, e.target.value)}
                            placeholder="Примечание..."
                            className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => removeFromEstimate(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Удалить"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-right font-semibold text-slate-700">
                      ИТОГО:
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-xl text-blue-600">
                      {calculations.materialsTotal.toLocaleString()} ₽
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Подвал */}
        <footer className="mt-8 text-center text-slate-500 text-sm">
          <p>🏗️ Конструктор строительных смет © 2024</p>
          <p className="mt-1">База содержит {materialsDatabase.length} материалов и услуг</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
