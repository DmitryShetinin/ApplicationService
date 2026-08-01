import { useEffect, useState } from "react";


const STATUSES = {
  1: "Новый",
  2: "В работе",
  3: "Завершён"
};



export default function Modal({
  type,
  ticket,
  employees = [],
  onSave,
  onClose
}) {


  const isEdit =
    type === "edit" && !!ticket;



  const defaultDeadline =
    new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .slice(0,16);



  const [description,setDescription] =
    useState("");



  const [authorId,setAuthorId] =
    useState("");



  const [executorId,setExecutorId] =
    useState("");



  const [status,setStatus] =
    useState(1);



  const [deadline,setDeadline] =
    useState(defaultDeadline);


    console.log(ticket)
  const allowedTransitions =
    ticket?.allowedTransitions ?? [];

    console.log(allowedTransitions)


  useEffect(() => {


    if(!ticket)
      return;



    setDescription(
      ticket.description ?? ""
    );


    setAuthorId(
      ticket.author?.id ?? ""
    );


    setExecutorId(
      ticket.executor?.id ?? ""
    );


    setStatus(
      Number(ticket.status ?? 1)
    );


    setDeadline(
      ticket.deadline
        ? new Date(ticket.deadline)
            .toISOString()
            .slice(0,16)
        : defaultDeadline
    );


  }, [ticket]);







  const getEmployeeName = (employee) => {

    return (
      employee.fullName ??
      employee.name ??
      employee.firstName ??
      "Без имени"
    );

  };







  const handleSubmit = (e)=>{

    e.preventDefault();


    if(!description.trim())
      return;



    onSave({

      description:
        description.trim(),

      authorId,

      executorId,

      status,

      deadline:
        new Date(deadline)
          .toISOString()

    });

  };








  return (

    <div

      className="modal-overlay"

      onClick={(e)=>{

        if(
          e.target === e.currentTarget
        ){
          onClose();
        }

      }}

    >



      <div className="modal">





        <div className="modal-header">


          <h3>

            {
              isEdit
                ? `Редактировать тикет #${ticket.number}`
                : "Создать тикет"
            }

          </h3>



          <button

            className="modal-close"

            onClick={onClose}

          >
            ×
          </button>


        </div>









        <form

          className="modal-body"

          onSubmit={handleSubmit}

        >







          <div className="form-group">


            <label>
              Описание
            </label>



            <textarea

              value={description}

              onChange={(e)=>
                setDescription(
                  e.target.value
                )
              }

              placeholder="Опишите задачу..."

              required

            />


          </div>












          <div className="form-row">



            <div className="form-group">


              <label>
                Автор
              </label>



              <select

                value={authorId}

                onChange={(e)=>
                  setAuthorId(
                    e.target.value
                  )
                }

              >



                {
                  employees.map(emp=>(

                    <option

                      key={emp.id}

                      value={emp.id}

                    >

                      {
                        getEmployeeName(emp)
                      }

                    </option>

                  ))
                }


              </select>


            </div>







            <div className="form-group">


              <label>
                Исполнитель
              </label>



              <select

                value={executorId}

                onChange={(e)=>
                  setExecutorId(
                    e.target.value
                  )
                }

              >



                {
                  employees.map(emp=>(

                    <option

                      key={emp.id}

                      value={emp.id}

                    >

                      {
                        getEmployeeName(emp)
                      }

                    </option>

                  ))
                }


              </select>


            </div>


          </div>














          <div className="form-row">



            <div className="form-group">


              <label>
                Статус
              </label>



              <select

                value={status}

                onChange={(e)=>
                  setStatus(
                    Number(
                      e.target.value
                    )
                  )
                }

              >



                <option value={status}>

                  {
                    STATUSES[status]
                  }

                </option>



                {
                  allowedTransitions.map(
                    transition => (

                      <option

                        key={
                          transition.status
                        }

                        value={
                          transition.status
                        }

                      >

                        {
                          STATUSES[
                            transition.status
                          ]
                        }

                      </option>

                    )
                  )
                }


              </select>


            </div>









            <div className="form-group">


              <label>
                Дедлайн
              </label>



              <input

                type="datetime-local"

                value={deadline}

                onChange={(e)=>
                  setDeadline(
                    e.target.value
                  )
                }

                required

              />


            </div>


          </div>








 









          <div className="modal-footer">


            <button

              type="button"

              className="btn btn-ghost"

              onClick={onClose}

            >

              Отмена

            </button>





            <button

              type="submit"

              className="btn btn-primary"

            >

              {
                isEdit
                  ? "Сохранить"
                  : "Создать"
              }

            </button>


          </div>





        </form>


      </div>


    </div>

  );

}