INSERT INTO public."Departments" ("Id", "Name") VALUES
('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'Разработка'),
('3fa85f64-5717-4562-b3fc-2c963f66afa5', 'Тестирование'),
('cb0b7080-4b96-4250-abd1-f7e37875c04a', 'Дизайн'),
('1682e601-c6cf-4714-85d5-258cf4f271c6', 'Бухгалтерия'),
('dd622479-7d5d-4746-99c1-e3b784f94b6e', 'HR'),
('0ffea8d6-4ce6-4b66-a259-715f3d5fa927', 'Маркетинг'),
('259322cb-7a77-48f3-8d3a-8b6f5b90d2ac', 'Аналитика')
ON CONFLICT ("Id") DO NOTHING;   


INSERT INTO public."Positions" ("Id", "Name") VALUES
('8026c5c9-e4bc-4381-9189-81d5250ed23b', 'Junior'),
('d955bc77-fcd1-418d-81c8-d9b1e5855f09', 'Middle'),
('99aacb41-70da-49aa-b9e7-503f654755eb', 'Junior+'),
('93136853-dc34-44fd-8da7-87398cc7da67', 'Senior')
ON CONFLICT ("Id") DO NOTHING;



INSERT INTO public."Employees" ("Id", "FirstName", "LastName", "MiddleName", "DepartmentId", "PositionId")
SELECT
  gen_random_uuid(),
  (ARRAY['Александр','Максим','Дмитрий','Сергей','Андрей','Алексей','Иван','Роман','Владимир','Евгений','Николай','Михаил','Артём','Денис','Олег'])[floor(random()*15+1)],
  (ARRAY['Иванов','Петров','Сидоров','Кузнецов','Смирнов','Попов','Васильев','Павлов','Соколов','Михайлов','Новиков','Фёдоров','Морозов','Волков','Алексеев'])[floor(random()*15+1)],
  (ARRAY['Александрович','Максимович','Дмитриевич','Сергеевич','Андреевич','Алексеевич','Иванович','Романович','Владимирович','Евгеньевич'])[floor(random()*10+1)],
  (ARRAY[
    '3fa85f64-5717-4562-b3fc-2c963f66afa5'::uuid,
    '3fa85f64-5717-4562-b3fc-2c963f66afa6'::uuid,
    'cb0b7080-4b96-4250-abd1-f7e37875c04a'::uuid,
    '1682e601-c6cf-4714-85d5-258cf4f271c6'::uuid,
    'dd622479-7d5d-4746-99c1-e3b784f94b6e'::uuid,
    '0ffea8d6-4ce6-4b66-a259-715f3d5fa927'::uuid,
    '259322cb-7a77-48f3-8d3a-8b6f5b90d2ac'::uuid
  ])[floor(random()*7+1)],
  (ARRAY[
    '8026c5c9-e4bc-4381-9189-81d5250ed23b'::uuid,
    'd955bc77-fcd1-418d-81c8-d9b1e5855f09'::uuid,
    '99aacb41-70da-49aa-b9e7-503f654755eb'::uuid,
    '93136853-dc34-44fd-8da7-87398cc7da67'::uuid
  ])[floor(random()*4+1)]
FROM generate_series(1, 1000);


WITH emp AS (
    SELECT array_agg("Id") AS ids
    FROM "Employees"
)

INSERT INTO "Tickets"
(
    "Id",
    "Number",
    "CreatedAt",
    "AuthorId",
    "ExecutorId",
    "Description",
    "Deadline",
    "Status"
)
SELECT
    gen_random_uuid(),

    gs.i + 100,

    now() - random() * interval '30 days',

    ids[(floor(random() * array_length(ids,1)) + 1)::int],

    ids[(floor(random() * array_length(ids,1)) + 1)::int],

    (ARRAY[
        'Разработать API',
        'Сверстать лендинг',
        'Настроить CI/CD',
        'Оптимизировать SQL',
        'Написать тесты',
        'Обновить зависимости',
        'Добавить тёмную тему',
        'Пофиксить баг',
        'Экспорт PDF',
        'Улучшить поиск'
    ])[(floor(random()*10)+1)::int]
    || ' #' || gs.i,

    now() + random() * interval '14 days',

    CASE
        WHEN random() < 0.33 THEN 1
        WHEN random() < 0.66 THEN 2
        ELSE 3
    END

FROM generate_series(1,1000000) gs(i)
CROSS JOIN emp;

