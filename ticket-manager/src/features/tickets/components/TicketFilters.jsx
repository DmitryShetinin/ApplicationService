export default function TicketFilters({
filters,
setFilters,
employees,
departments
}){

return(
<div className="filter-bar">

<div className="filter-group">
<label>Статус</label>
<select
value={filters.status}
onChange={e=>setFilters(prev=>({
...prev,
status:e.target.value
}))}
>
<option value="">Все статусы</option>
<option value="1">Новый</option>
<option value="2">В работе</option>
<option value="3">Завершён</option>
</select>
</div>

<div className="filter-group">
<label>Исполнитель</label>
<select
value={filters.executorId}
onChange={e=>setFilters(prev=>({
...prev,
executorId:e.target.value
}))}
>
<option value="">Все исполнители</option>
{employees.map(emp=>(
<option
key={emp.id}
value={emp.id}
>
{emp.name}
</option>
))}
</select>
</div>

<div className="filter-group">
<label>Подразделение</label>
<select
value={filters.departmentId}
onChange={e=>setFilters(prev=>({
...prev,
departmentId:e.target.value
}))}
>
<option value="">Все подразделения</option>
{departments.map(dep=>(
<option
key={dep.id}
value={dep.id}
>
{dep.name}
</option>
))}
</select>
</div>

<div className="filter-group">
<label>
<input
type="checkbox"
checked={filters.onlyOverdue}
onChange={e=>setFilters(prev=>({
...prev,
onlyOverdue:e.target.checked
}))}
/>
Только просроченные
</label>
</div>

<button
className="filter-reset"
onClick={()=>
setFilters({
status:"",
executorId:"",
departmentId:"",
onlyOverdue:false
})
}
>
Сбросить
</button>

</div>
);

}