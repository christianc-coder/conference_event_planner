import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from './avSlice';
import { toggleMealSelection } from './mealsSlice';
const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  //selectors
  const venueItems = useSelector((state) => state.venue);
  const addonsStateItems = useSelector((state) => state.addons);
  const mealsStateItems = useSelector((state) => state.meals);

  //venue
  const dispatch = useDispatch();
  const remainingAuditoriumQuantity = 3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;

  //Funcion que alterna true a false y viceversa
  const handleToggleItems = () => {
    console.log("handleToggleItems called");
    setShowItems(!showItems);
  };

  //venue
  const handleAddToCart = (index) => {
    if (venueItems[index].name === "Auditorium Hall (Capacity:200)" && venueItems[index].quantity >= 3) {
      return;
    }
    dispatch(incrementQuantity(index));
  };
  //venue
  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  //addons
  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity({index}));
  };

  const handleDecrementAvQuantity = (index) => {
    dispatch(decrementAvQuantity({index}));
  };

  //meals
  const handleMealSelection = (index) => {
    const items = mealsStateItems[index]
    if (items.selected && items.type === 'mealForPeople') {
      dispatch(toggleMealSelection({index}));
    } else {
      dispatch(toggleMealSelection({index}));
    }

  };

  //Agrega los productos del usuario al array itemss

  //venue
  const getItemsFromTotalCost = () => {
    const itemss = [];
    venueItems.forEach((items) => {
      if (items.quantity > 0) {
        itemss.push({ ...items, type: 'venue' })
      }
    });
    //addons
    addonsStateItems.forEach((items) => {
      if (items.quantity > 0 &&
        !itemss.some((i) => i.name === items.name && i.type === 'addons')
      ) {
        itemss.push({ ...items, type: 'addons' })
      }
    });

    //meals
    mealsStateItems.forEach((items) => {
      if (items.selected) {
        const itemsParaMostrar = { ...items, type: 'meals', numberOfPeople };
        itemsParaMostrar.numberOfPeople = numberOfPeople;
        itemss.push(itemsParaMostrar);
      }
    });
    return itemss;

  };

  const itemsCart = getItemsFromTotalCost();

  const ItemsDisplay = ({ items }) => {
    console.log(items);
    return (
      <>
        <div className="display_box1">
          <table style={{gap: 10}}>
            <thead>
              {items.length === 0 && <p>Items no seleccionados</p>}
              <tr>
                <th>Name</th>
                <th>Costo por unidad</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {/*Esto saldra en un componente */}

              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.cost}</td>
                  <td>
                    {item.type === "meals" || item.numberOfPeople
                      ? `Para una cantidad de ${numberOfPeople} personas`
                      : item.quantity}
                  </td>
                  <td>
                    {item.type === "meals" || item.numberOfPeople
                      ? `${item.cost * (item.numberOfPeople || numberOfPeople)}`
                      : `${item.cost * item.quantity}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    } else if (section === "addons") {
      addonsStateItems.forEach((items) => {
        totalCost += items.cost * items.quantity
      });
    } else if (section === "meals") {
      mealsStateItems.forEach((items) => {
        if (items.selected) {
          const peopleCount = Number(numberOfPeople) > 0 ? Number(numberOfPeople) : 1;
          totalCost += items.cost * peopleCount;
        }
      });
    }


    return totalCost;
  };

  //Recoleccion de valores de las funciones
  const venueTotalCost = calculateTotalCost("venue");
  const addonsTotalCost = calculateTotalCost("addons");
  const mealsTotalCost = calculateTotalCost("meals");

  const navigateToProducts = (idType) => { 
    if (idType == '#venue' || idType == '#addons' || idType == '#meals' || idType == '#showDetails') {
      if (showItems) { // Check if showItems is false
        setShowItems(!showItems); // Toggle showItems to true only if it's currently false
      }
    }
  }

  //Objeto con los valores 
  const totalCosts = {
    venue: venueTotalCost,
    addons: addonsTotalCost,
    meals: mealsTotalCost
  };

  return (
    <>
      <navbar className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>
        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")} >Venue</a>
            <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
            <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
            <a href="#showDetails"  className="details_button" onClick={() => navigateToProducts('#showDetails')}>show
              Details</a>
          </div>
          
          
        </div>
      </navbar>
      <div className="main_container">
      
        <div className="items-information">
          <div id="venue" className="venue_container container_main">
            <div className="text">

              <h1>Venue Room Selection</h1>
            </div>
            <div className="venue_selection">
              {venueItems.map((item, index) => (
                <div className="venue_main" key={index}>
                  <div className="img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="text">{item.name}</div>
                  <div>${item.cost}</div>
                  <div className="button_container">
                    {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (

                      <>
                        <button
                          className={venueItems[index].quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          &#8211;
                        </button>
                        <span className="selected_count">
                          {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                        </span>
                        <button
                          className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                          onClick={() => handleAddToCart(index)}
                        >
                          &#43;
                        </button>
                      </>
                    ) : (
                      <div className="button_container">
                        <button
                          className={venueItems[index].quantity === 0 ? " btn-warning btn-disabled" : "btn-warning btn-plus"}
                          onClick={() => handleRemoveFromCart(index)}
                        >
                          &#8211;
                        </button>
                        <span className="selected_count">
                          {venueItems[index].quantity > 0 ? ` ${venueItems[index].quantity}` : "0"}
                        </span>
                        <button
                          className={venueItems[index].quantity === 10 ? " btn-success btn-disabled" : "btn-success btn-plus"}
                          onClick={() => handleAddToCart(index)}
                        >
                          &#43;
                        </button>


                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="total_cost">Total Cost: ${venueTotalCost}</div>
          </div>

          {/*Necessary Add-ons*/}
          <div id="addons" className="venue_container container_main">



            <div className="text">

              <h1> Add-ons Selection</h1>

            </div>
            <div className="addons_selection">
              {/*Recuerda que de aqui se manda enl index del arreglo que tu hiciste, alas funciones
            Y de ahi llega al reducer y se pasa al payload*/}
              {addonsStateItems.map((I, index) => (
                <div className="av_data venue_main" key={index}>
                  {/*Imagen del producto*/}
                  <div className="img">
                    <img src={I.img} alt={I.name} />
                  </div>
                  <div className="text"> {/*Nombre del producto*/}
                    {I.name}
                  </div>
                  <div> {/*costo*/}
                    {I.cost}
                  </div>
                  <div className="addon_btn">
                    <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}>-</button>
                    <span className="quantity-value">{I.quantity}</span>
                    <button className="btn-success" onClick={() => handleIncrementAvQuantity(index)}>+</button>
                  </div>

                
                </div>
              ))}

            </div>
            
                <div className="total_cost">Costo Total: {addonsTotalCost}</div>

            </div>
              {/* Meal Section */}

              < div id="meals" className="venue_container container_main" >

                <div className="text">

                  <h1>Meals Selection</h1>
                </div>

                <div className="input-container venue_selection">

                  <label htmlFor="numberOfPeople"><h3>Numero de personas</h3></label>

                  <input type="number" className="input_box5" id="numberPepople" value={numberOfPeople}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      {/*Valida la Entrada del usuario */ }
                      if (isNaN(value) && value > 1) {
                        setNumberOfPeople(1);
                      } else {
                        setNumberOfPeople(value);
                      }

                    }} min="1" />

                </div>

                <div className="meal_selection">
                  {mealsStateItems.map((item, index) => (
                    <div className="meal-item" key={index} style={{ padding: 15 }}>
                      <div className="inner">

                        <input type="checkbox" id={`meal_${index}`} checked={item.selected} onChange={() => handleMealSelection(index)} />

                        {/*label puede influir en el input checked*/}
                        <label htmlFor="meal-item">{item.name}</label>
                      </div>

                      <div className="meal-cost">{item.cost}</div>
                    </div>
                  ))}


                </div>
                <div className="total_cost">Total Cost:{mealsTotalCost}</div>


              </div>

              <div id="showDetails" className="total_amount_detail">
            <TotalCost totalCosts={totalCosts} handleClick={handleToggleItems} ItemsDisplay={<ItemsDisplay items={itemsCart} />} /></div>
         </div>
      </div>
    </>
  );
};

export default ConferenceEvent;
