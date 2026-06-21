# FibApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**calculateIndexValue**](#calculateindexvalue) | **POST** /api/indices | Submit a new index|
|[**getAllIndices**](#getallindices) | **GET** /api/indices/all | Get all indices from Postgres|
|[**getAvailableIndexValues**](#getavailableindexvalues) | **GET** /api/indices/values | Get current indices and values from Redis|
|[**getHealthCheck**](#gethealthcheck) | **GET** / | Health check|

# **calculateIndexValue**
> CalculateIndexValue200Response calculateIndexValue(calculateIndexValueRequest)


### Example

```typescript
import {
    FibApi,
    Configuration,
    CalculateIndexValueRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new FibApi(configuration);

let calculateIndexValueRequest: CalculateIndexValueRequest; //

const { status, data } = await apiInstance.calculateIndexValue(
    calculateIndexValueRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **calculateIndexValueRequest** | **CalculateIndexValueRequest**|  | |


### Return type

**CalculateIndexValue200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful submission |  -  |
|**422** | Index too high |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllIndices**
> Array<GetAllIndices200ResponseInner> getAllIndices()


### Example

```typescript
import {
    FibApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FibApi(configuration);

const { status, data } = await apiInstance.getAllIndices();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<GetAllIndices200ResponseInner>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of indices from the database |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAvailableIndexValues**
> { [key: string]: string; } getAvailableIndexValues()


### Example

```typescript
import {
    FibApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FibApi(configuration);

const { status, data } = await apiInstance.getAvailableIndexValues();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: string; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A map of indices and their calculated values |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHealthCheck**
> string getHealthCheck()


### Example

```typescript
import {
    FibApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FibApi(configuration);

const { status, data } = await apiInstance.getHealthCheck();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**string**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Returns a greeting |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

